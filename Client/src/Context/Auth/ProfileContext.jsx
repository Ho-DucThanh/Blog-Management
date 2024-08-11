import React, { createContext, useContext } from "react";
import useProfile from "../../Hooks/useProfile";

const ProfileContext = createContext({});

const ProfileProvider = ({ children }) => {
  const profile = useProfile();
  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext, ProfileProvider };
