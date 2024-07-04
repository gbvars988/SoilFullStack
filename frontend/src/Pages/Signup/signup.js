/**
 * @fileoverview Signup component for user registration.
 * This component provides a registration form for new users.
 * It validates user inputs, handles user creation, and displays error messages.
 */
import React, { useState } from "react";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import { findUser, createUser, findUserByEmail } from "../../Data/repository";
import { useUser } from "../../Context/UserContext";

/**
 * Signup component for user registration.
 * @component
 */
export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [fields, setFields] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  /**
   * Handles input changes for the signup form.
   * @param {object} event - The event object.
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFields({ ...fields, [name]: value });
    if (name === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  /**
   * Handles form submission for user registration.
   * Validates user inputs and creates a new user.
   * @param {object} event - The event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    const { trimmedFields, isValid } = await handleValidation();
    if (!isValid) return;
    try {
      // Create User
      console.log(trimmedFields.email);
      const user = await createUser(trimmedFields);

      // Set user state
      setUser(user);
      console.log("Success: User registered and logged in successfully.");

      // Show popup message
      setShowPopup(true);

      // Redirect
      setTimeout(() => {
        setShowPopup(false);
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error registering user:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrors({ server: error.response.data.message });
      }
    }
  };

  /**
   * Validates user inputs for the signup form.
   * @returns {object} Trimmed fields and a valid = true or false.
   */
  const handleValidation = async () => {
    const trimmedFields = trimFields();
    const currentErrors = {};

    if (!trimmedFields.username) {
      currentErrors.username = "Username is required.";
    } else if (trimmedFields.username.length > 32) {
      currentErrors.username = "Username cannot exceed 32 characters.";
    } else if ((await findUser(trimmedFields.username)) !== null) {
      currentErrors.username = "Username is already registered.";
    }

    if (!trimmedFields.firstname) {
      currentErrors.firstname = "First name is required.";
    } else if (trimmedFields.firstname.length > 40) {
      currentErrors.firstname = "First name cannot exceed 40 characters.";
    }

    if (!trimmedFields.lastname) {
      currentErrors.lastname = "Last name is required.";
    } else if (trimmedFields.lastname.length > 40) {
      currentErrors.lastname = "Last name cannot exceed 40.";
    }

    if (!trimmedFields.password) {
      currentErrors.password = "Password is required.";
    } else if (
      trimmedFields.password.length < 8 ||
      !/(?=.*[A-Z])(?=.*\d)/.test(trimmedFields.password)
    ) {
      currentErrors.password =
        "Password must be at least 8 characters long and include at least one uppercase letter and one digit.";
    }
    if (trimmedFields.confirmPassword !== trimmedFields.password) {
      currentErrors.confirmPassword = "Passwords do not match.";
    }

    if (!trimmedFields.email) {
      currentErrors.email = "Email is required.";
    } else if (trimmedFields.email.length > 100) {
      currentErrors.email = "Email length cannot be greater than 100.";
    } else if (!isValidEmail(trimmedFields.email)) {
      currentErrors.email = "Invalid email format.";
    } else if ((await findUserByEmail(trimmedFields.email)) !== null) {
      currentErrors.email = "Email is already registered.";
    }

    setErrors(currentErrors);

    return { trimmedFields, isValid: Object.keys(currentErrors).length === 0 };
  };

  /**
   * Validates the format of an email address.
   * @param {string} email - The email address to validate.
   * @returns {boolean} True if the email is valid, otherwise false.
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Trims whitespace from user input fields.
   * @returns {object} An object containing trimmed fields.
   */
  const trimFields = () => {
    const trimmedFields = {};
    Object.keys(fields).map((key) => {
      trimmedFields[key] = fields[key].trim();
    });
    setFields(trimmedFields);

    return trimmedFields;
  };

  /**
   * Simple algorithm to calculate password strength.
   * @param {string} password - The password to test.
   * @returns {string} The strength of the password ('Weak', 'Medium', or 'Strong').
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

  return (
    <div className="signup-bg">
      <div className="signup-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="control-label">
              Username
            </label>
            <input
              name="username"
              id="username"
              className="form-control"
              value={fields.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <div className="text-danger">{errors.username}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="firstname" className="control-label">
              First name
            </label>
            <input
              name="firstname"
              id="firstname"
              className="form-control"
              value={fields.firstname}
              onChange={handleInputChange}
            />
            {errors.firstname && (
              <div className="text-danger">{errors.firstname}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="lastname" className="control-label">
              Last name
            </label>
            <input
              name="lastname"
              id="lastname"
              className="form-control"
              value={fields.lastname}
              onChange={handleInputChange}
            />
            {errors.lastname && (
              <div className="text-danger">{errors.lastname}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="control-label">
              Email
            </label>
            <input
              name="email"
              id="email"
              className="form-control"
              value={fields.email}
              onChange={handleInputChange}
            />
            {errors.email && <div className="text-danger">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="control-label">
              Password{" "}
              <small className="text-muted">
                must be at least 8 characters
              </small>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              value={fields.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <div className="text-danger">{errors.password}</div>
            )}
            {fields.password && (
              <div
                className={`password-strength ${passwordStrength.toLowerCase()}`}
              >
                Password strength: {passwordStrength}
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="control-label">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="form-control"
              value={fields.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <div className="text-danger">{errors.confirmPassword}</div>
            )}
          </div>
          <div className="form-group">
            <input className="btn" type="submit" value="Register" />
          </div>
        </form>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Registration successful!</h2>
          </div>
        </div>
      )}
    </div>
  );
}
