import React from "react";
import "./Section.scss";

function Section({ fullWidth, children, className }) {
  return (
    <div className={className}>
      {fullWidth ? children : <div className="container">{children}</div>}
    </div>
  );
}

export default Section;
