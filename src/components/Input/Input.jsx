import React from "react";
import "./Input.scss";

function Input({
  label,
  name,
  handleChange,
  type,
  placeholder,
  required,
  error,
}) {
  return (
    <div className="wrapper">
      <label className="label" htmlFor={name}>
        {label}
        <input
          className="input"
          id={name}
          key={name}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          onChange={handleChange}
        />
      </label>
      <span>{error}</span>
    </div>
  );
}

export default Input;
