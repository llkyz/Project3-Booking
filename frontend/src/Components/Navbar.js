import React from "react";
import { Link } from "react-router-dom";

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

export default function Navbar({ loggedIn }) {
  return (
    <div className="navbar">
      <Link to="/">
        <h1>SPPFY CALENDAR</h1>
      </Link>
      <div className="user">
        {loggedIn ? <ProfileButton /> : <LoginButton />}
      </div>
    </div>
  );
}
