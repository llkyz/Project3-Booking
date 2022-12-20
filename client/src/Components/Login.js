import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import config from "../config";

export default function Login({ loggedIn, setLoggedIn }) {
  const [errorMessage, setErrorMessage] = useState();
  const navigate = useNavigate();

  if (loggedIn) {
    navigate("/profile");
  }

  async function doLogin(event) {
    event.preventDefault();
    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch(config.BACKEND_URL + "user/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    if (res.ok) {
      setLoggedIn(true);
      navigate("/profile");
    } else {
      setErrorMessage(await res.json());
    }
  }

  return (
    <>
      <h1>Login</h1>
      {errorMessage ? <h3 style={{ color: "red" }}>{errorMessage}</h3> : ""}
      <form
        method="POST"
        action={config.BACKEND_URL + "user/login"}
        className="entryForm"
        style={{ width: "50%", margin: "0 auto", marginTop: "30px" }}
      >
        <div className="label">Username</div>
        <input type="text" name="username" />
        <div className="label">Password</div>
        <input type="password" name="password" />
        <input
          className="entryFormSubmit"
          style={{
            gridColumn: "1 / span 2",
            margin: "auto 20%",
            marginTop: "20px",
          }}
          type="submit"
          value="Login"
          onClick={(event) => doLogin(event)}
        />
      </form>

      <Link to="/register">
        <h4>New to our site? Register here</h4>
      </Link>
    </>
  );
}
