import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Calendar from "./Components/Calendar";
import Profile from "./Components/Profile";
import config from "./config";

function App() {
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {
    async function checkToken() {
      const response = await fetch(config.BACKEND_URL + "checktoken", {
        mode: "cors",
        credentials: "include",
      });
      if (response.status !== 200) {
        setLoggedIn(false);
      }
    }
    checkToken();
    //eslint-disable-next-line
  }, []);

  return (
    <BrowserRouter>
      <Navbar loggedIn={loggedIn} />
      <div className="content">
        <Routes>
          <Route index element={<Home />} />
          <Route
            path="/login"
            element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route path="/register" element={<Register loggedIn={loggedIn} />} />
          <Route path="/calendar" element={<Calendar loggedIn={loggedIn} />} />
          <Route
            path="/profile"
            element={<Profile loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
