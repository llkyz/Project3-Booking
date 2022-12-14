import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Calendar from "./Components/Calendar";
import Profile from "./Components/Profile";
import config from "./config";
import checkAccess from "./Authorization/checkAccess";
import UserList from "./Components/UserList";
import Bookings from "./Components/Bookings";
import Holidays from "./Components/Holidays";
import Offdays from "./Components/Offdays";
import Pickups from "./Components/Pickups";
import backgroundImg from "./Assets/background.jpg";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessLevel, setAccessLevel] = useState("user");
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollOffset(window.pageYOffset);
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
  }, []);

  useEffect(() => {
    async function checkToken() {
      const response = await fetch(config.BACKEND_URL + "auth/checktoken", {
        credentials: "include",
      });
      if (response.status === 200) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    }
    checkToken();
    if (loggedIn) {
      checkAccess(setAccessLevel);
    }
  }, [loggedIn]);

  return (
    <BrowserRouter>
      <div className="backgroundImage">
        <img src={backgroundImg} />
      </div>
      <Navbar
        loggedIn={loggedIn}
        accessLevel={accessLevel}
        scrollOffset={scrollOffset}
      />
      <div className="content">
        <Routes>
          <Route index element={<Home loggedIn={loggedIn} />} />
          <Route
            path="/login"
            element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/register"
            element={<Register loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/calendar"
            element={
              <Calendar
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                accessLevel={accessLevel}
              />
            }
          />
          <Route
            path="/profile"
            element={<Profile loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/userlist"
            element={
              <UserList
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                accessLevel={accessLevel}
              />
            }
          />
          <Route
            path="/bookings"
            element={
              <Bookings
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                accessLevel={accessLevel}
              />
            }
          />
          <Route
            path="/holidays"
            element={
              <Holidays
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                accessLevel={accessLevel}
              />
            }
          />
          <Route
            path="/offdays"
            element={
              <Offdays
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                accessLevel={accessLevel}
              />
            }
          />
          <Route
            path="/pickups"
            element={
              <Pickups
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                accessLevel={accessLevel}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
