import React, { useState, useEffect } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";

export default function Register({ loggedIn }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [passwordAlert, setPasswordAlert] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });

  console.log(passwordAlert);

  useEffect(() => {
    function checkPassword() {
      console.log(password);
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

  return (
    <>
      <h1>Register New User</h1>
      <form method="POST" action={config.BACKEND_URL + "user/"}>
        <input type="text" name="username" placeholder="User Name" />
        <input
          type="text"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <input type="submit" value="Register" />
        {password ? <PasswordValidation /> : ""}
      </form>
    </>
  );
}
