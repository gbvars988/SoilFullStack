import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faShoppingCart,
  faSignIn,
  faSignOutAlt,
  faStore,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../Assets/soil-logo.png";
import "./navbar.css";
import { useUser } from "../../Context/UserContext";

export default function Navbar() {
  const { user, logout } = useUser();
  return (
    <div className="navbar">
      <Link className="soil-logo" to="/">
        <img src={Logo} alt="Soil Logo" />
      </Link>
      <nav>
        <Link to="/">
          <FontAwesomeIcon icon={faHome} className="nav-icon" />
          <span>Home</span>
        </Link>

        {!user && (
          <>
            <Link to="/signin">
              <FontAwesomeIcon icon={faSignIn} className="nav-icon" />
              <span>Sign In</span>
            </Link>

            <Link to="/signup">
              <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
              <span>Sign Up</span>
            </Link>
          </>
        )}

        {user && (
          <>
            <Link to="/products">
              <FontAwesomeIcon icon={faStore} className="nav-icon" />
              <span>Products</span>
            </Link>

            <Link to="/profile">
              <FontAwesomeIcon icon={faUser} className="nav-icon" />
              <span>{user.first_name}'s Profile</span>
            </Link>

            <Link to="/signin" onClick={logout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
              <span>Logout</span>
            </Link>

            <Link to="/cart">
              <FontAwesomeIcon icon={faShoppingCart} className="nav-icon" />
              <span>Cart</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
