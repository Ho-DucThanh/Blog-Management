import React, { createContext } from "react";
import useSignUp from "../../Hooks/useSignUp";

const SignupContext = createContext({});

const SignupProvider = ({ children }) => {
  const signup = useSignUp();
  return (
    <SignupContext.Provider value={signup}>{children}</SignupContext.Provider>
  );
};

export { SignupContext, SignupProvider };
