import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Button = (props) => {
  return <button className={"button "+ props.className} onClick={props.onClick}>{props.title}</button>;
};

export default Button;
