import React, { useState } from "react";
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

function SidebarButton({ sidebarVisible, setSidebarVisible }) {
  function toggleSideBar() {
    if (sidebarVisible) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }

  return (
    <img src={hamburger} className="sidebarButton" onClick={toggleSideBar} />
  );
}

function Sidebar({ accessLevel }) {
  return (
    <div className="sidebar">
      {
        <Link to="/calendar">
          <h1>{accessLevel === "user" ? "View Calendar" : "View/Edit Calendar"}</h1>
        </Link>
      }
      {accessLevel === "admin" ? (
        <Link to="/userlist">
          <h1>User List</h1>
        </Link>
      ) : (
        ""
      )}
    </div>
  );
}

export default function Navbar({ loggedIn, accessLevel }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="navbar">
      {loggedIn ? (
        <SidebarButton
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
        />
      ) : (
        ""
      )}
      {loggedIn && sidebarVisible ? <Sidebar accessLevel={accessLevel} /> : ""}
      <Link to="/">
        <h1>SPPFY CALENDAR</h1>
      </Link>
      <div className="user">
        {loggedIn ? <ProfileButton /> : <LoginButton />}
      </div>
    </div>
  );
}
