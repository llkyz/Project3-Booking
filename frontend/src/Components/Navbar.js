import React from "react";
import { Link } from "react-router-dom";
import CheckAuth from "../Authorization/CheckAuth";

function LoginButton() {
  return (
    <Link to="/login">
      <h4>Log In</h4>
    </Link>
  );
}

function ProfileButton() {
  return (
    <Link to="/profile">
      <h4>Profile</h4>
    </Link>
  );
}

export default function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">
        <h1>SPPFY CALENDAR</h1>
      </Link>
      <div className="user">
        <CheckAuth
          Primary={ProfileButton}
          Alternative={LoginButton}
          action={"show"}
        />
      </div>
    </div>
  );
}
