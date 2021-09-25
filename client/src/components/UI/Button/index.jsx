import React from "react";
import "./style.css";

const Button = (props) => {
  if (props.black)
    return (
      <button
        className={"button button--black " + props.className}
        onClick={props.onClick}
      >
        {props.title}
      </button>
    );
  return (
    <button className={"button " + props.className} onClick={props.onClick}>
      {props.title}
    </button>
  );
};

export default Button;
