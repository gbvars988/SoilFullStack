/**
 * @fileoverview Login component for user authentication.
 * This component provides a login form for users to authenticate.
 * It verifies user credentials and shows a popup on successful login.
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyUser } from "../../Data/repository";
import { useUser } from "../../Context/UserContext";
import "./signin.css";

/**
 * Login component for user authentication.
 * @component
 */
export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [fields, setFields] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  /**
   * Handles input changes for the login form.
   * @param {object} event - The event object.
   */
  const handleInputChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  /**
   * Handles form submission for login.
   * Verifies user credentials and navigates to profile page if success.
   * @param {object} event - The event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = await verifyUser(fields.username, fields.password);

    if (user === null) {
      setFields({ ...fields, password: "" });
      setErrorMessage("Username and/or password invalid, please try again.");
      return;
    }
    setUser(user);
    console.log("Success: User logged in successfully.");

    // Show popup message.
    setShowPopup(true);

    setTimeout(() => {
      setShowPopup(false);
      navigate("/profile");
    }, 2000);
  };

  return (
    <div className="signin-bg">
      <div className="signin-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="control-label">
              Username
            </label>
            <input
              name="username"
              id="username"
              className="input-login"
              value={fields.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password" className="control-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className=" input-login"
              value={fields.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input type="submit" className="btn btn-primary" value="Login" />
          </div>
          {errorMessage !== null && (
            <div className="form-group">
              <span className="text-danger">{errorMessage}</span>
            </div>
          )}
        </form>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Login Successful! Welcome {fields.username}.</h2>
          </div>
        </div>
      )}
    </div>
  );
}
