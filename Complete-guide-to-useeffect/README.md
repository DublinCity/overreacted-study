# A Complete Guide to useEffect
> It’s only after I stopped looking at the useEffect Hook through the prism of the familiar class lifecycle methods that everything came together for me.

- React hooks 를 사용할때는 lifecycle의 시각으로 보면 안된다. 이는 두 구현의 멘탈모델이 다르기 때문이다.

## TLDR
-  Question: How do I replicate componentDidMount with useEffect?  
  - 비슷하지만 같지 않다. `useEffect(fn,[])` 는 `deps` 가 없어서 한번 실행되지만 그 시점의 `state`, `props` 를 capture 하기 때문이고 class instance 의 `props`, `state` 는 `가변(이하 mutable)` 하기 때문이다. 만약 `useEffect` 에서 처음 렌더링 되고 `mutable` 한 값을 사용하고 싶다면, `createRef` 를 사용해서 mutable 객체를 사용해도 된다. 그런데 보통 더 간단한 방법이 있으므로 클래스와 멘탈모델이 다르다는 것을 기억하고 `useEffect` 의 방식으로 생각하는 것이 필요하다. hooks 의 멘탈모델은 lifecycle이 아니라 state 를 synchronization(동기화)하는데 가깝다.
- Question: How do I correctly fetch data inside useEffect? What is []?
  - `[]` 는 `effect` 가 React data flow 에 참여하는 값을 사용하지 않는다는 것을 의미한다.

## Each Render Has Its Own… Everything
- 각 렌더는 클로저를 생성하여 그 당시의 `state`, `props`, `effect` 를 capture 하고 있으므로 익숙해지도록 한다.

## So What About Cleanup?
> React only runs the effects after letting the browser paint. 
> The previous effect is cleaned up after the re-render with new props
1. React 가 새로운 상태에 대한 UI를 렌더
2. 브라우저가 paint, 새로운 상태에 대한 UI를 스크린에서 볼 수 있다.
3. React 가 이전 렌더의 effect의 리턴으로 넘겨진 cleans up 함수를 실행.
4. React 가 새로운 상태에 대한 effect를 실행.

## Synchronization, Not Lifecycle
> React synchronizes the DOM according to our current props and state.
- hooks 의 멘탈모델은 synchronization 이다. state 가 변화하는 과정보다는 결과에 초점을 맞춰야한다.

## Don’t Lie to React About Dependencies
> all values from inside your component that are used by the effect must be in dependency array

## Two Ways to Be Honest About Dependencies
1. `useEffect` 내부에서 사용하고 있는 컴포넌트의 value 를 반드시 `deps` 에 추가한다
2. component의 value 를 사용하지 않도록 코드를 수정한다.
  1. update 함수를 사용하여, 스스로를 변경한다.
    - 문제: 이 방법은 다른 state 와 서로 관섭하여 업데이트 할 수 없으므로 한계가 있다.
    - 문제: 전달 받은 props 를 사용하지 못한다.
  2. `useReducer` 를 사용하여 `Actions` 과 `update` 를 분리하면 위의 2가지 문제를 해결할 수 있고, 상태변경이 아닌, message를 전달할 수 있다.
  > When setting a state variable depends on the current value of another state variable, you might want to try replacing them both with useReducer.

  > A reducer lets you decouple expressing the “actions” that happened in your component from how the state updates in response to them.

## Are Functions Part of the Data Flow?
- class 방식의 `componentDidUpdated` 에서는 `this.props.fetchDate === prevProps.fetchDate` 이다. 따라서 method 가 data 로 사용되지 않는다.
- 그러나 `useCallback` 를 사용하게 되면 dependency 를 사용하여 변경된 함수를 생성할 수 있기 때문에 데이터로써 사용가능하다.
- 단, `useCallback(fn,[])` 을 무작정 리렌더링을 막기 위한 최적화용도로 사용하지마라. 메모이징하는 비용은 꽁짜가 아니고, 성능개선은 이런 최적화보다 다른 곳에서 일어난다. 즉 함수가 pass down 되고, child 의 effect에서 사용될때만 유용하다.