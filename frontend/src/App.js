import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CheckAuth from "./Authorization/CheckAuth";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Calendar from "./Components/Calendar";
import Profile from "./Components/Profile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="content">
        <Routes>
          <Route index element={<Home />} />
          <Route
            path="/login"
            element={
              <CheckAuth
                Primary={Profile}
                Alternative={Login}
                action={"show"}
              />
            }
          />
          <Route
            path="/register"
            element={
              <CheckAuth
                Primary={Profile}
                Alternative={Register}
                action={"show"}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <CheckAuth
                Primary={Calendar}
                Alternative={"/login"}
                action={"redirect"}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <CheckAuth
                Primary={Profile}
                Alternative={"/login"}
                action={"redirect"}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
