import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";

export default function Login({ loggedIn, setLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState(false);
  const navigate = useNavigate();

  if (loggedIn) {
    navigate("/profile");
  }

  async function doLogin(event) {
    event.preventDefault();
    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value
    };
    const res = await fetch(config.BACKEND_URL + "user/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    console.log(`Response ${res.status}: ${result}`);
    if (res.status === 200) {
      setLoggedIn(true);
      navigate("/profile");
    } else {
      setErrorMessage(true);
    }
  }

  return (
    <>
      <h1>Login Page</h1>
      {errorMessage ? <h2>Invalid username/password</h2> : ""}
      <form method="POST" action={config.BACKEND_URL + "user/login"}>
        <input type="text" name="username" placeholder="User Name" />
        <input type="text" name="password" placeholder="Password" />
        <input
          type="submit"
          value="Log In"
          onClick={(event) => doLogin(event)}
        />
      </form>

      <Link to="/register">
        <h4>New? Register here</h4>
      </Link>
    </>
  );
}
