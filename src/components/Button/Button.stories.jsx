import { storiesOf } from "@storybook/react";
import React from "react";
import Button from "./Button";

storiesOf("Button", module)
  .add("Primary Button", () => (
    <Button
      className="button button-primary"
      handleClick={() => console.log("clicked")}
    >
      Primary Button
    </Button>
  ))
  .add("Secondary Button", () => (
    <Button className="button" handleClick={() => console.log("clicked")}>
      Secondary Button
    </Button>
  ));
