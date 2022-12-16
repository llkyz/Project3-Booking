import React, { useState, useRef, useEffect } from "react";
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
      alt="profile"
      onClick={gotoProfile}
      style={
        scrollOffset > 200
          ? { height: "30px", width: "30px", marginTop: "2px" }
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
      alt="menu"
      className="sidebarButton"
      onClick={toggleSideBar}
      style={
        scrollOffset > 200 ? { height: "30px", width: "30px", top: "8px" } : {}
      }
    />
  );
}

function useOutsideClick(ref, setSidebarVisible) {
  useEffect(() => {
    function handleOutsideClick(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setSidebarVisible(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref, setSidebarVisible]);
}

function Sidebar({ accessLevel, scrollOffset, setSidebarVisible }) {
  const wrapper = useRef(null);
  useOutsideClick(wrapper, setSidebarVisible);

  return (
    <div
      ref={wrapper}
      className="sidebar"
      style={scrollOffset > 200 ? { top: "50px" } : {}}
    >
      {
        <Link to="/calendar">
          <h1>Calendar</h1>
        </Link>
      }
      {accessLevel !== "user" ? (
        <>
          <Link to="/bookings">
            <h3>Bookings</h3>
          </Link>
          <Link to="/holidays">
            <h3>Holidays</h3>
          </Link>
          <Link to="/offdays">
            <h3>Offdays</h3>
          </Link>
          <Link to="/pickups">
            <h3>Pickups</h3>
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
    <>
      {loggedIn && sidebarVisible ? (
        <Sidebar
          accessLevel={accessLevel}
          scrollOffset={scrollOffset}
          setSidebarVisible={setSidebarVisible}
        />
      ) : (
        ""
      )}
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
    </>
  );
}
