import React, { createContext } from "react";
import useLogin from "../../Hooks/useLogin";

const LoginContext = createContext({});

const LoginProvider = ({ children }) => {
  const login = useLogin();
  return (
    <LoginContext.Provider value={login}>{children}</LoginContext.Provider>
  );
};

export { LoginContext, LoginProvider };
