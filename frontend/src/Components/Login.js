import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <>
      <h1>Login Page</h1>
      <form method="POST" action={process.env.BACKEND_URL + "user/login"}>
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