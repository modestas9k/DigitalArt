import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";
import AuthProvider from "./contexts/AuthContext";
import "./Servers/firebase.js";
import "normalize.css";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
