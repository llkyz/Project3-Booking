import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import hamburger from "../Assets/hamburger.png";
import spffyLogo from "../Assets/sppfy_logo.png";
import profilePic from "../Assets/profile.png";

function LoginButton({ scrollOffset }) {
  const navigate = useNavigate();

  function gotoLogin() {
    window.scrollTo(0, 0);
    navigate("/login");
  }

  return (
    <div
      className="login"
      onClick={gotoLogin}
      style={scrollOffset > 200 ? { fontSize: "1em", marginTop: "-3px" } : {}}
    >
      Log In
    </div>
  );
}

function ProfileButton({ scrollOffset }) {
  const navigate = useNavigate();

  function gotoProfile() {
    window.scrollTo(0, 0);
    navigate("/profile");
  }

  return (
    <img
      className="profile"
      src={profilePic}
      onClick={gotoProfile}
      style={
        scrollOffset > 200
          ? { height: "30px", width: "30px", marginTop: "0px" }
          : {}
      }
    />
  );
}

function SidebarButton({ sidebarVisible, setSidebarVisible, scrollOffset }) {
  function toggleSideBar() {
    if (sidebarVisible) {
      setSidebarVisible(false);
    } else {
      setSidebarVisible(true);
    }
  }

  return (
    <img
      src={hamburger}
      className="sidebarButton"
      onClick={toggleSideBar}
      style={
        scrollOffset > 200 ? { height: "30px", width: "30px", top: "8px" } : {}
      }
    />
  );
}

function Sidebar({ accessLevel, scrollOffset }) {
  return (
    <div className="sidebar" style={scrollOffset > 200 ? { top: "50px" } : {}}>
      {
        <Link to="/calendar">
          <h1>Calendar</h1>
        </Link>
      }
      {accessLevel !== "user" ? (
        <>
          <Link to="/bookings">
            <h2>Bookings</h2>
          </Link>
          <Link to="/holidays">
            <h2>Holidays</h2>
          </Link>
          <Link to="/offdays">
            <h2>Offdays</h2>
          </Link>
          <Link to="/pickups">
            <h2>Pickups</h2>
          </Link>
        </>
      ) : (
        ""
      )}
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

export default function Navbar({ loggedIn, accessLevel, scrollOffset }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  function gotoHome() {
    window.scrollTo(0, 0);
    navigate("/");
  }

  function gotoCalendar() {
    window.scrollTo(0, 0);
    navigate("/calendar");
  }

  return (
    <div
      className="navbar"
      style={scrollOffset > 200 ? { height: "50px" } : {}}
    >
      {loggedIn ? (
        <SidebarButton
          sidebarVisible={sidebarVisible}
          setSidebarVisible={setSidebarVisible}
          scrollOffset={scrollOffset}
        />
      ) : (
        ""
      )}
      {loggedIn && sidebarVisible ? (
        <Sidebar accessLevel={accessLevel} scrollOffset={scrollOffset} />
      ) : (
        ""
      )}
      <div
        className="headerLogo"
        style={scrollOffset > 200 ? { height: "50px" } : {}}
      >
        <img
          src={spffyLogo}
          alt="SppfyLogo"
          onClick={loggedIn ? gotoCalendar : gotoHome}
          style={
            scrollOffset > 200
              ? { marginRight: "0", verticalAlign: "top", marginTop: "5px" }
              : {}
          }
        />
        {scrollOffset > 200 ? (
          ""
        ) : (
          <h1 onClick={loggedIn ? gotoCalendar : gotoHome}>CALENDAR</h1>
        )}
      </div>
      <div className="user">
        {loggedIn ? (
          <ProfileButton scrollOffset={scrollOffset} />
        ) : (
          <LoginButton scrollOffset={scrollOffset} />
        )}
      </div>
    </div>
  );
}
