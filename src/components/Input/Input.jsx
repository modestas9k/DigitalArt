import React from "react";
import "./Input.scss";

function Input({
  label,
  name,
  handleChange,
  type,
  placeholder,
  required,
  children,
  value,
  id,
  key,
  defaultValue,
}) {
  switch (type) {
    case "textarea":
      return (
        <div className="wrapper">
          <label className="label" htmlFor={name}>
            {label}
            <textarea
              className="input"
              id={id}
              key={key}
              value={value}
              name={name}
              type={type}
              defaultValue={defaultValue}
              placeholder={placeholder}
              required={required}
              onChange={handleChange}
            />
          </label>
          <div className="children-wrapper">{children}</div>
        </div>
      );

    default:
      return (
        <div className="wrapper">
          <label className="label" htmlFor={name}>
            {label}
            <input
              className="input"
              id={id}
              key={key}
              value={value}
              name={name}
              type={type}
              defaultValue={defaultValue}
              placeholder={placeholder}
              required={required}
              onChange={handleChange}
            />
          </label>
          <div className="children-wrapper">{children}</div>
        </div>
      );
  }
}

export default Input;
