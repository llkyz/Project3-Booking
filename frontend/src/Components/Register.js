import React from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";

export default function Register({ loggedIn }) {
  const navigate = useNavigate();

  if (loggedIn) {
    navigate("/profile");
  }

  return (
    <>
      <h1>Register New User</h1>
      <form method="POST" action={config.BACKEND_URL + "user/"}>
        <input type="text" name="username" placeholder="User Name" />
        <input type="text" name="password" placeholder="Password" />
        <input type="submit" value="Register" />
      </form>
    </>
  );
}
