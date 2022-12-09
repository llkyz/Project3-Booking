import React from "react";
import { Link } from "react-router-dom";
import hamburger from "../Assets/hamburger.png";

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

function SideMenuButton() {
  function toggleSideBar() {
    console.log("Toggle side bar");
  }

  return (
    <img src={hamburger} className="sideMenuButton" onClick={toggleSideBar} />
  );
}

export default function Navbar({ loggedIn, accessLevel }) {
  return (
    <div className="navbar">
      {loggedIn ? <SideMenuButton /> : ""}
      <Link to="/">
        <h1>SPPFY CALENDAR</h1>
      </Link>
      <div className="user">
        {loggedIn ? <ProfileButton /> : <LoginButton />}
      </div>
    </div>
  );
}
