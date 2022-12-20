import React, { useState, useEffect } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";
import tick from "../Assets/tick.svg";

export default function Profile({ loggedIn, setLoggedIn }) {
  const [profileData, setProfileData] = useState();
  const [changePassDialog, setChangePassDialog] = useState();
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAlert, setPasswordAlert] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    length: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    function checkLoggedIn() {
      if (!loggedIn) {
        navigate("/login");
      }
    }

    async function getProfileData() {
      const res = await fetch(config.BACKEND_URL + "user", {
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        setProfileData({ username: result.username, access: result.access });
      } else {
        setLoggedIn(false);
      }
    }
    checkLoggedIn();
    getProfileData();
  }, [setLoggedIn, loggedIn, navigate]);

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

  async function doLogout() {
    const res = await fetch(config.BACKEND_URL + "user/logout", {
      method: "GET",
      credentials: "include",
    });
    if (res.ok) {
      navigate("/");
      setLoggedIn(false);
    }
  }

  async function changePassword(event) {
    event.preventDefault();
    if (event.target.form[1].value === event.target.form[2].value) {
      setChangePassDialog(
        "Current password and new password cannot be the same"
      );
    } else {
      let formBody = {
        username: profileData.username,
        currentpassword: event.target.form[1].value,
        newpassword: event.target.form[2].value,
      };
      const res = await fetch(config.BACKEND_URL + "user", {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      });
      let result = await res.json();
      if (res.ok) {
        setPassword("");
        setOldPassword("");
      }
      setChangePassDialog(result);
    }
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

  return (
    <>
      <h1>Profile Page</h1>
      {profileData ? (
        <>
          <div className="entry">
            <div className="entryTextGrid" style={{ margin: "auto 7%" }}>
              <div className="entryTextGrid">
                <div className="label" style={{ fontSize: "1.5em" }}>
                  Username
                </div>
                <div className="entryTextItem" style={{ fontSize: "1.5em" }}>
                  {profileData.username}
                </div>
              </div>
              <div className="entryTextGrid">
                <div className="label" style={{ fontSize: "1.5em" }}>
                  Access Level
                </div>
                <div className="entryTextItem" style={{ fontSize: "1.5em" }}>
                  {profileData.access[0].toUpperCase() +
                    profileData.access.substring(1)}
                </div>
              </div>
            </div>
          </div>
          <h2>Change Password</h2>
          {changePassDialog ? <h4>{changePassDialog}</h4> : ""}
          <form className="entryForm" style={{ margin: "auto 20%" }}>
            <input type="hidden" name="username" value={profileData.username} />
            <div className="label">Current Password</div>
            <input
              className="entryFormChild"
              type="password"
              name="currentpassword"
              value={oldPassword}
              onChange={(self) => setOldPassword(self.target.value)}
            />
            <div className="label">New Password</div>
            <input
              className="entryFormChild"
              type="password"
              name="newpassword"
              value={password}
              onChange={(self) => setPassword(self.target.value)}
            />
            <input
              className="entryFormSubmit"
              style={{
                gridColumn: "1 / span 2",
                margin: "auto 20%",
              }}
              type="submit"
              value="Submit"
              disabled={
                passwordAlert.lowercase &&
                passwordAlert.uppercase &&
                passwordAlert.number &&
                passwordAlert.length &&
                oldPassword.length !== 0
                  ? false
                  : true
              }
              onClick={(event) => changePassword(event)}
            />
          </form>
          {password ? (
            <div className="registerValidation" style={{ marginTop: "20px" }}>
              <div className="registerValidationHeader">New Password</div>
              <PasswordValidation />
            </div>
          ) : (
            ""
          )}
          <button
            className="modButton"
            style={{
              margin: "40px auto 0px auto",
              fontSize: "1.5em",
              fontWeight: "bold",
              border: "3px solid rgb(50,50,50)",
              display: "block",
            }}
            onClick={doLogout}
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <div className="loading" />
          <h1>Loading...</h1>
        </>
      )}
    </>
  );
}
