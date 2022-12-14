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
  }, []);

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
          <h4>Username: {profileData.username}</h4>
          <h4>
            Access Level:{" "}
            {profileData.access[0].toUpperCase() +
              profileData.access.substring(1)}
          </h4>
          <button onClick={doLogout}>Log Out</button>
          <h2>Change Password</h2>
          {changePassDialog ?? ""}
          <form>
            <input type="hidden" name="username" value={profileData.username} />
            <input
              type="text"
              name="currentpassword"
              placeholder="Current Password"
            />
            <input type="text" name="newpassword" placeholder="New Password" />
            <input
              type="submit"
              value="Submit"
              onClick={(event) => changePassword(event)}
            />
          </form>
        </>
      ) : (
        ""
      )}
    </>
  );
}
