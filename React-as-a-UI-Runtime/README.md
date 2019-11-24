# React as a UI Runtime
> So what is React useful for? Very abstractly, it helps you write a program that predictably manipulates a complex host tree in response to external events like interactions, network responses, timers, and so on.
- React는 외부 인터렉션에 반응하여 예측가능하게 Host tree를 조작하는 프로그램을 작성하게 도와준다.
## Host Tree
- 웹에서 DOM Tree 를 의미한다.(React Native 나 다른 곳에서는 다른 것을 의미한다.)
## Host instance
- Host Tree 를 구성하고 있는 Node 를 의미한다. 웹에서는 DOM node를 가리킨다.

## Renderer
- ReactDOM, React Native 와 같은 것들을 가리킨다. 이들 Renderer는 React에게 Host Tree 를 조작할 수 있는 API를 알려준다.
- Renderer는 mutate / persist 두가지 중 한 모드로 동작하게 되는데 ReactDOM의 경우에는
노드 생성하고, props을 변경하고, 노드를 더하고 지우는 mutate 방식으로 동작한다.

## React Element vs. Component
> A React element is a plain JavaScript object. It can describe a host instance.
- (host instance 와 달리)React Element 는 immutable 하다. 렌더함수가 실행될 때 마다 항상 재-생성되고 버려진다.
- Component 는 `named props`를 전달 받을 수 있고 React Element 과 logic을 가지고 있는 Custom element 라고 생각해도 좋다.

## Entry Point
```
ReactDOM.render(
  // { type: 'button', props: { className: 'blue' } }
  <button className="blue" />,
  document.getElementById('container')
);
```
- React는 ReactDOM에게 `<button>`(host instance)을 생성하고 `class`를 조작할 것을 요청한다. recursive하게 하위노드도 진행된다.
- 그리고 나면 생성된 host instances를 target에 `appendChild` 한다.

## Reconciliation
- DOM을 생성하는 것은 느리고, focus, scroll과 같은 중요한 상태를 잃어 버리기 때문에 기존의 host instance를 update 하는 방식으로 동작한다.
- 이전 렌더와 다음 렌더에, `동일한 위치` 에 있는 element의 `type` 이 **일치** 한다면, React는 host instance를 재사용한다.

## Lists
- 이전에 `Reconcilation`과 같이 한다면, `List`의 순서가 바뀌었을때 re-order하지 않고, 각각의 item을 update한다.
- `key`는 이런 문제를 해결하기 위해 사용하게 된다. React가 `key`를 보게 되면 이전 렌더링의  `type` 과 `key`값이 같은 host instance를 재사용 하게 된다.(불필요한 host instance update 비용을 줄일 수 있다.)

## Recursive / Capitalize
- React Component 는 항상 대문자로 시작한다. 이유는 `JSX`가 대문자로 시작하는 Component를 볼 때 type에 컴포넌트(함수)를 할당하기 때문이다. (React element의 경우는 element type(ex. "button")을 string 형태로 type에 할당한다.)
- React 는 element.type이 function이면 Child Component 를 재귀적으로 실행한다.


## IoC
- 우리는 `CustomElement({...props})` 함수 호출이 아닌 `<Form {...props}>`를 전달한다. 이것은 IoC(제어의 역전)로 우리가 실행하지 않고 React가 해당 함수를 실행한다는 것을 의미한다.
- IoC의 장점
  - 