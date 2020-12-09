import { storiesOf } from "@storybook/react";
import React from "react";
import Button from "./Button";

storiesOf("Button", module)
  .add("Primary Button", () => (
    <button
      className="button button-primary"
      handleClick={() => console.log("clicked")}
    >
      Primary Button
    </button>
  ))
  .add("Secondary Button", () => (
    <Button className="button" handleClick={() => console.log("clicked")}>
      Secondary Button
    </Button>
  ));
