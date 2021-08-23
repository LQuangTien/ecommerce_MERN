import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Input = (props) => {
  return (
    <input
      className={"input " + props.className}
      type={props.type || "text"}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  );
};

export default Input;
