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
  progress,
}) {
  switch (type) {
    case "textarea":
      return (
        <div className="input__wrapper">
          <label className="input__label" htmlFor={name}>
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
          <div className="input__children-wrapper">{children}</div>
        </div>
      );

    case "file":
      return (
        <div className="input__wrapper">
          <label className="input__label" htmlFor={name}>
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
          {progress && <progress value={progress} max="100" />}
          <div className="input__children-wrapper">{children}</div>
        </div>
      );

    default:
      return (
        <div className="input__wrapper">
          <label className="input__label" htmlFor={name}>
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
          <div className="input__children-wrapper">{children}</div>
        </div>
      );
  }
}

export default Input;
