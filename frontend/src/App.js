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
import Events from "./Components/Events";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [accessLevel, setAccessLevel] = useState("user");

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
      <Navbar loggedIn={loggedIn} accessLevel={accessLevel} />
      <div className="content">
        <Routes>
          <Route index element={<Home />} />
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
            path="/events"
            element={
              <Events
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
