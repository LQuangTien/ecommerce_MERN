import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";

const Anchor = (props) => {
  return (
    <span className="anchor" {...props.className}  onClick={props.onClick}>
      {props.title}
    </span>
  );
};
export default Anchor;
