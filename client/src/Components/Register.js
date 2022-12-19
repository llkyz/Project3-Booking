import React, { useState, useEffect } from "react";
import config from "../config";
import { Link, useNavigate } from "react-router-dom";
import tick from "../Assets/tick.svg";

export default function Register({ loggedIn }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [usernameAlert, setUsernameAlert] = useState(false);
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
      if (username.length < 3) {
        setUsernameAlert(false);
      } else {
        setUsernameAlert(true);
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
        {
          <div className="validationEntry">
            <h4 className="validation">At least 1 lowercase letter</h4>
            {passwordAlert.lowercase ? (
              <img className="validationTick" src={tick} alt="tick" />
            ) : (
              ""
            )}
          </div>
        }
        {
          <div className="validationEntry">
            <h4 className="validation">At least 1 uppercase letter</h4>
            {passwordAlert.uppercase ? (
              <img className="validationTick" src={tick} alt="tick" />
            ) : (
              ""
            )}
          </div>
        }
        {
          <div className="validationEntry">
            <h4 className="validation">At least 1 number</h4>
            {passwordAlert.number ? (
              <img className="validationTick" src={tick} alt="tick" />
            ) : (
              ""
            )}
          </div>
        }
        {
          <div className="validationEntry">
            <h4 className="validation">At least 8 characters long</h4>
            {passwordAlert.length ? (
              <img className="validationTick" src={tick} alt="tick" />
            ) : (
              ""
            )}
          </div>
        }
      </div>
    );
  }

  async function registerUser(event) {
    event.preventDefault();
    let formBody = {
      username: event.target.form[0].value,
      password: event.target.form[1].value,
    };
    const res = await fetch(config.BACKEND_URL + "user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
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
      <h1>Register</h1>
      {registerUserResult ? (
        <h2 style={{ margin: "50px auto" }}>{registerUserResult}</h2>
      ) : (
        ""
      )}
      {registerSuccess ? (
        <Link to="/login">
          <h4 style={{ textDecoration: "underline" }}>Go to Login</h4>
        </Link>
      ) : (
        <>
          <form
            method="POST"
            action={config.BACKEND_URL + "user/"}
            className="entryForm"
            style={{ width: "50%", margin: "0 auto", marginTop: "30px" }}
          >
            <div className="label">Username</div>
            <input
              type="text"
              name="username"
              autoComplete="off"
              className="entryFormChild"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <div className="label">Password</div>
            <input
              type="password"
              name="password"
              className="entryFormChild"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <input
              type="submit"
              value="Register"
              className="entryFormSubmit"
              style={{
                gridColumn: "1 / span 2",
                margin: "auto 20%",
                marginTop: "20px",
              }}
              disabled={
                passwordAlert.lowercase &&
                passwordAlert.uppercase &&
                passwordAlert.number &&
                passwordAlert.length &&
                usernameAlert
                  ? false
                  : true
              }
              onClick={(event) => registerUser(event)}
            />
          </form>
          <div className="registerValidationContainer">
            <div className="registerValidation">
              <div className="registerValidationHeader">Username</div>
              <div className="validationEntry">
                <h4 className="validation">At least 3 characters long</h4>
                {usernameAlert ? (
                  <img className="validationTick" src={tick} alt="tick" />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="registerValidation">
              <div className="registerValidationHeader">Password</div>
              <PasswordValidation />
            </div>
          </div>
        </>
      )}
    </>
  );
}
