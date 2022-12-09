import React from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";

export default function Login({ loggedIn }) {
  const navigate = useNavigate();

  if (loggedIn) {
    navigate("/profile");
  }

  return (
    <>
      <h1>Login Page</h1>
      <form method="POST" action={config.BACKEND_URL + "user/login"}>
        <input type="text" name="username" placeholder="User Name" />
        <input type="text" name="password" placeholder="Password" />
        <input type="submit" value="Log In" />
      </form>

      <Link to="/register">
        <h4>New? Register here</h4>
      </Link>
    </>
  );
}
