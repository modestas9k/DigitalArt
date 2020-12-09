import React from "react";
//import * as S from "./Button.style";
import "./Button.scss";

function Button({ children, handleClick, className }) {
  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}

export default Button;
