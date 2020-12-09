import React from "react";
import ReactDOM from "react-dom";
import Routes from "./Routes";
import AuthProvider from "./contexts/AuthContext";
import "./Servers/firebase";
import "normalize.css";
import "./index.scss";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Routes />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
