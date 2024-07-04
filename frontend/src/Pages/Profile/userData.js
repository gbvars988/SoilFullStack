/**
 * @fileoverview useUserData custom hook to fetch and update user data.
 * This hook manages user data state, loading state, and error state.
 * It provides functionality to fetch user data by username and update user data.
 */

import { useState, useEffect } from "react";
import { findUser, getUsers, updateUser } from "../../Data/repository.js";
import { useUser } from "../../Context/UserContext.js";

/**
 * Custom hook to fetch and update user data.
 * @param {string} username - The username of the user whose data is to be fetched.
 * @returns {object} An object containing userData, loading state, and updateUserData function.
 */
const useUserData = (username) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { setUser } = useUser();

  useEffect(() => {
    fetchUserData(username);
  }, [username]);

  /**
   * Fetches user data by username.
   * @param {string} username - The username of the user to be fetched.
   */
  const fetchUserData = async (username) => {
    try {
      console.log(username);
      const loggedInUserData = await findUser(username);

      if (loggedInUserData) {
        setUserData(loggedInUserData);
        setUser(loggedInUserData);
        setLoading(false);
        setError(null);
      } else {
        throw new Error("Logged in user not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
      setError(error.message);
    }
  };

  /**
   * Updates user data.
   * @param {object} updatedData - The updated user data.
   */
  const updateUserData = async (updatedData) => {
    try {
      await updateUser(userData.username, updatedData);
      fetchUserData(username);
    } catch (error) {
      console.error("Error updating user data:", error);
      setError(error.message);
    }
  };

  return {
    userData,
    loading,
    updateUserData,
  };
};

export default useUserData;
