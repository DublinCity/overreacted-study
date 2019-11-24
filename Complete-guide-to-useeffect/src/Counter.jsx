import React, { useEffect, useReducer } from "react";
import "./App.css";

const countReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return {
        ...state,
        count: state.count + state.step
      };
      break;
    case "CHANGE_STEP":
      return {
        ...state,
        step: action.step
      };
    default:
      throw new Error("no matched Action");
  }
};

const Counter = () => {
  const [{ count, step }, dispatch] = useReducer(countReducer, {
    count: 0,
    step: 1
  });

  useEffect(() => {
    const countInterval = setInterval(() => {
      dispatch({ type: "INCREMENT" });
    }, 1000);

    return () => {
      clearInterval(countInterval);
    };
  }, []);

  return (
    <div
      style={{
        border: "1px solid gray",
        margin: "10px auto",
        padding: "20px",
        width: "50%",
        textAlign: "center"
      }}
    >
      <h3>Counter Example</h3>
      <div>{count}</div>
      <input
        value={step}
        onChange={e =>
          dispatch({ type: "CHANGE_STEP", step: Number(e.target.value) })
        }
      ></input>
    </div>
  );
};
export default Counter;
