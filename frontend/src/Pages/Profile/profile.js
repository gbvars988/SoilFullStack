/**
 * @fileoverview MyProfile component allows users to view and update their profile information.
 * It includes functionalities for updating first name, last name, email, and password.
 * Password strength is displayed, and validation errors are shown as needed.
 */
import React, { useState, useEffect } from "react";
import useUserData from "./userData";
import { useUser } from "../../Context/UserContext";
import "./profile.css";

/**
 * MyProfile component.
 * Displays and allows updating user profile information.
 * @returns {JSX.Element}
 */
export default function MyProfile() {
  const { user } = useUser();
  console.log("logging user object from profile", user);
  const { userData, loading, updateUserData } = useUserData(user.username);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  /**
   * Simple algorithm to calculate password strength.
   * @param {string} password - The password to test.
   * @returns {string} The strength of the password: "Weak", "Medium", or "Strong".
   */
  const calculatePasswordStrength = (password) => {
    let strength = "Weak";
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (password.length >= 8 && strongPasswordRegex.test(password)) {
      strength = "Strong";
    } else if (password.length >= 6) {
      strength = "Medium";
    }

    return strength;
  };

  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
      setFirstName(userData.first_name);
      setLastName(userData.last_name);
      setEmail(userData.email);
      setPassword("");
      setConfirmPassword("");
    }
  }, [userData]);

  /**
   * Handles input changes for the form fields.
   * @param {object} event - The event object from the input change.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    }
  };

  /**
   * Validates the form inputs.
   * @returns {boolean} True if all inputs are valid, otherwise false.
   */
  const handleValidation = async () => {
    const currentErrors = {};

    if (!firstName.trim()) {
      currentErrors.firstName = "First name is required.";
    } else if (firstName.length > 40) {
      currentErrors.firstName = "First name length cannot be greater than 40.";
    }

    if (!lastName.trim()) {
      currentErrors.lastName = "Last name is required.";
    } else if (lastName.length > 40) {
      currentErrors.lastName = "Last name length cannot be greater than 40.";
    }

    if (!email.trim()) {
      currentErrors.email = "Email is required.";
    } else if (email.length > 100) {
      currentErrors.email = "Email length cannot be greater than 100.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      currentErrors.email = "Invalid email format.";
    }

    if (
      password &&
      (password.length < 8 || !/(?=.*[A-Z])(?=.*\d)/.test(password))
    ) {
      currentErrors.password =
        "Password must be at least 8 characters long and include at least one uppercase letter and one digit.";
    }

    if (password !== confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  /**
   * Handles updating the user profile.
   */
  const handleUpdate = async () => {
    const isValid = await handleValidation();
    if (!isValid) return;

    const updatedData = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
    };

    if (password) {
      updatedData.password = password;
    }

    updateUserData(updatedData);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div className="profile-bg">
      <div className="profile-container">
        <h1>Welcome to your profile, {userData.first_name}!</h1>
        <h2>Update your details below</h2>
        <label>
          <h3>Username:</h3>
          <p className="value">{userData.username}</p>
        </label>
        <label>
          <h3>First Name:</h3>
          <input
            type="text"
            name="firstName"
            value={firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && (
            <div className="text-danger">{errors.firstName}</div>
          )}
        </label>
        <label>
          <h3>Last Name:</h3>
          <input
            type="text"
            name="lastName"
            value={lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && (
            <div className="text-danger">{errors.lastName}</div>
          )}
        </label>
        <label>
          <h3>Email:</h3>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </label>
        <label>
          <h3>Password (leave blank if not changing):</h3>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter new password"
            onChange={handleInputChange}
          />
          {errors.password && (
            <div className="text-danger">{errors.password}</div>
          )}
          {password && (
            <div
              className={`password-strength ${passwordStrength.toLowerCase()}`}
            >
              Password strength: {passwordStrength}
            </div>
          )}
        </label>
        <label>
          <h3>Confirm Password:</h3>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm new password"
            onChange={handleInputChange}
          />
          {errors.confirmPassword && (
            <div className="text-danger">{errors.confirmPassword}</div>
          )}
        </label>
        <button className="update-button" onClick={handleUpdate}>
          Update Profile
        </button>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Profile updated successfully!</h2>
          </div>
        </div>
      )}
    </div>
  );
}
