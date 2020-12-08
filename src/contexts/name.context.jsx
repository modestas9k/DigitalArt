import React, { useState, createContext } from "react";

export const NameContext = createContext({});

const name = "Modestas";

export const NameProvider = ({ children }) => {
  const [state, setState] = useState(name);
  return (
    <NameContext.Provider value={{state, setState}}>
      {children}
    </NameContext.Provider>
  )
};