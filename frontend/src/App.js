import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Calendar from "./Components/Calendar";
import CheckAuth from "./Components/CheckAuth";

function App() {
  const [expressData, setExpressData] = useState();

  // useEffect(() => {
  //   async function callBackendAPI() {
  //     const response = await fetch("http://127.0.0.1:5000/fetch/sophie");
  //     let data = await response.json();
  //     if (response.status !== 200) {
  //       throw Error(data.message);
  //     }
  //     setExpressData(data);
  //   }
  //   callBackendAPI();
  // }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="content">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/calendar"
            element={<CheckAuth ProtectedComponent={Calendar} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
