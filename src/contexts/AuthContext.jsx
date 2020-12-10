import React, { useState, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState();
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setState(user.uid);
    } else {
      setState("");
    }
  });
  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
