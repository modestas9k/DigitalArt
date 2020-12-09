import { storiesOf } from "@storybook/react";
import React from "react";
import Input from "./Input";

storiesOf("Input", module).add("Input", () => (
  <Input label="Name" placeholder="Enter your name" type="text" />
));
