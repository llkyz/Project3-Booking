import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import config from "../config";

export default function UserList({ loggedIn, setLoggedIn, accessLevel }) {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    function checkLoginAccess() {
      if (!loggedIn || accessLevel != 2) {
        navigate("/login");
      }
    }
    async function fetchAllUsers() {
      const res = await fetch(config.BACKEND_URL + "admin/userindex", {
        method: "GET",
        credentials: "include",
      });
      let result = await res.json();
      if (res.status === 200) {
        setUserData(result);
      } else {
        console.log(result);
      }
    }
    checkLoginAccess();
    fetchAllUsers();
  }, []);

  function UserEntry({ userData }) {
    return userData.map((data) => {
      return (
        <div className="userEntry">
          <h4>Username: {data.username}</h4>
          <h4>
            Access Level:{" "}
            {data.access === 0
              ? "User"
              : data.access === 1
              ? "Staff"
              : data.access === 2
              ? "Admin"
              : "Unknown"}
          </h4>
        </div>
      );
    });
  }

  return (
    <>
      <h1>User List (admin only)</h1>
      {userData ? <UserEntry userData={userData} /> : ""}
    </>
  );
}
