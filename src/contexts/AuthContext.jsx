import React, { useState, createContext } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState();
  return (
    <AuthContext.Provider value={{ state, setState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
