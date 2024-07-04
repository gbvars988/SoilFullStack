/**
 * @file userContext.js
 * @description Provides a context and provider for managing user state within the application.
 * Uses React Context API to create a UserContext and provides user-related functions.
 *
 * @module UserContext
 */

import React, { createContext, useState, useContext, useEffect } from "react";
import { removeUser, getUser } from "../Data/repository";

const UserContext = createContext();

/**
 * Custom hook to use the UserContext.
 * @returns {Object} The current user context value.
 */
export const useUser = () => useContext(UserContext);

/**
 * UserProvider component that wraps its children with UserContext.Provider.
 * Manages user state and persists it to local storage.
 *
 * @param {React.ReactNode} props.children - The children components wrapped by the provider.
 * @returns {JSX.Element} The UserContext provider component.
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load user from local storage when the provider initialises
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever user state changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    removeUser();
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
