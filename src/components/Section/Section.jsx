import React from "react";
import "./Section.scss";

function Section({ fullWidth, children }) {
  return (
    <div className="section">
      {fullWidth ? children : <div className="container">{children}</div>}
    </div>
  );
}

export default Section;
