import React, { useState, useEffect } from "react";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ loggedIn }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [usernameAlert, setUsernameAlert] = useState();
  const [password, setPassword] = useState("");
  const [passwordAlert, setPasswordAlert] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });
  const [registerUserResult, setRegisterUserResult] = useState();
  const [registerSuccess, setRegisterSuccess] = useState(false);

  useEffect(() => {
    function checkUsername() {
      if (username.length < 3 && username.length !== 0) {
        setUsernameAlert(true);
      } else {
        setUsernameAlert(false);
      }
    }
    checkUsername();
  }, [username]);

  useEffect(() => {
    function checkPassword() {
      let testLowerCase = /[a-z]/;
      let testUpperCase = /[A-Z]/;
      let testNumber = /[0-9]/;
      let testLength = false;
      if (password) {
        testLength = password.length >= 8;
      }
      setPasswordAlert({
        lowercase: testLowerCase.test(password),
        uppercase: testUpperCase.test(password),
        number: testNumber.test(password),
        length: testLength,
      });
    }
    checkPassword();
  }, [password]);

  if (loggedIn) {
    navigate("/profile");
  }

  function PasswordValidation() {
    return (
      <div>
        {passwordAlert.lowercase ? (
          ""
        ) : (
          <p>Password must contain at least 1 lowercase letter</p>
        )}
        {passwordAlert.uppercase ? (
          ""
        ) : (
          <p>Password must contain at least 1 uppercase letter</p>
        )}
        {passwordAlert.number ? (
          ""
        ) : (
          <p>Password must contain at least 1 number</p>
        )}
        {passwordAlert.length ? (
          ""
        ) : (
          <p>Password length must be at least 8 characters</p>
        )}
      </div>
    );
  }

  async function registerUser(event) {
    event.preventDefault();
    let formBody = [];
    formBody.push(
      encodeURIComponent("username") +
        "=" +
        encodeURIComponent(event.target.form[0].value)
    );
    formBody.push(
      encodeURIComponent("password") +
        "=" +
        encodeURIComponent(event.target.form[1].value)
    );
    formBody = formBody.join("&");
    const res = await fetch(config.BACKEND_URL + "user", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    });
    let result = await res.json();
    console.log(`Response ${res.status}: ${result}`);
    if (res.status === 200) {
      setRegisterUserResult(result);
      setRegisterSuccess(true);
      event.target.form[0].value = "";
      event.target.form[1].value = "";
    } else {
      setRegisterUserResult(result);
    }
  }

  return (
    <>
      <h1>Register New User</h1>
      {registerUserResult ? <h2>{registerUserResult}</h2> : ""}
      {registerSuccess ? (
        <Link to="/login">
          <h4>Go to Login</h4>
        </Link>
      ) : (
        <form method="POST" action={config.BACKEND_URL + "user/"}>
          <input
            type="text"
            name="username"
            placeholder="User Name"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <input
            type="submit"
            value="Register"
            disabled={
              passwordAlert.lowercase &&
              passwordAlert.uppercase &&
              passwordAlert.number &&
              passwordAlert.length
                ? false
                : true
            }
            onClick={(event) => registerUser(event)}
          />
          {usernameAlert ? (
            <h4>Username must be at least 3 characters long</h4>
          ) : (
            ""
          )}
          {password ? <PasswordValidation /> : ""}
        </form>
      )}
    </>
  );
}
