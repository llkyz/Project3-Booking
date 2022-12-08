import React, { useState, useEffect } from "react";
import config from "../config";

export default function Profile() {
  const [profileData, setProfileData] = useState();

  useEffect(() => {
    async function getProfileData() {
      const res = await fetch(config.BACKEND_URL + "user", {
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      console.log(`Response ${res.status}: ${result}`);
      setProfileData({ username: result.username, access: result.access });
    }
    getProfileData();
  }, []);

  async function doLogout() {
    const res = await fetch(config.BACKEND_URL + "logout", {
      method: "GET",
      credentials: "include",
    });
    console.log(res.status);
  }

  return (
    <>
      <h1>Profile Page</h1>
      {profileData ? (
        <>
          <h4>Username: {profileData.username}</h4>
          <h4>Access Level: {profileData.access}</h4>
          <button onClick={doLogout}>Log Out</button>
        </>
      ) : (
        ""
      )}
    </>
  );
}
