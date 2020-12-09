import React from "react";
//import * as S from "./Button.style";
import "./Button.scss";

function Button({ children, handleClick }) {
  return (
    <button className="button" onClick={handleClick}>
      {children}
    </button>
  );
}

export default Button;
