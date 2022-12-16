import React, { useState, useEffect } from "react";
import config from "../config";
import { useNavigate } from "react-router-dom";

export default function Profile({ loggedIn, setLoggedIn }) {
  const [profileData, setProfileData] = useState();
  const [changePassDialog, setChangePassDialog] = useState();
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
      if (res.status === 200) {
        setProfileData({ username: result.username, access: result.access });
      } else {
        setLoggedIn(false);
      }
    }
    checkLoggedIn();
    getProfileData();
  }, [setLoggedIn, loggedIn, navigate]);

  async function doLogout() {
    const res = await fetch(config.BACKEND_URL + "user/logout", {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 200) {
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
      if (res.status === 200) {
        event.target.form[1].value = "";
        event.target.form[2].value = "";
      }
      setChangePassDialog(result);
    }
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
            />
            <div className="label">New Password</div>
            <input
              className="entryFormChild"
              type="password"
              name="newpassword"
            />
            <input
              className="entryFormSubmit"
              style={{
                gridColumn: "1 / span 2",
                margin: "auto 20%",
              }}
              type="submit"
              value="Submit"
              onClick={(event) => changePassword(event)}
            />
          </form>
          <button
            className="modButton"
            style={{
              marginTop: "40px",
              fontSize: "1.5em",
              fontWeight: "bold",
              border: "3px solid rgb(50,50,50)",
            }}
            onClick={doLogout}
          >
            Log Out
          </button>
        </>
      ) : (
        ""
      )}
    </>
  );
}
