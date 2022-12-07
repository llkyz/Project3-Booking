import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">
        <h1>SPPFY CALENDAR</h1>
      </Link>
      <div className="user">
        <Link to="/login">
          <h4>Log In</h4>
        </Link>
      </div>
    </div>
  );
}
