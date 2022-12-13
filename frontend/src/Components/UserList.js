import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import config from "../config";

function UserEntry({ data, fetchAllUsers }) {
  const [showDelete, setShowDelete] = useState(false)
  const [showAccess, setShowAccess] = useState(false)

  async function executeDelete(username) {
    let formBody = encodeURIComponent("username") +
    "=" +
    encodeURIComponent(username);
    const res = await fetch(config.BACKEND_URL + "user", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    });
    let result = await res.json();
    console.log(result)
    fetchAllUsers()
  }

  async function executeEdit(username, event) {
    event.preventDefault()
    let formBody = []

    formBody.push(encodeURIComponent("username") +
    "=" +
    encodeURIComponent(username))
    formBody.push(encodeURIComponent("access") +
    "=" +
    encodeURIComponent(event.target.form[0].value))
    formBody = formBody.join("&");

    const res = await fetch(config.BACKEND_URL + "user", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    });
    let result = await res.json();
    console.log(result)
    fetchAllUsers()
    setShowAccess(false)
  }

    return (
      <div className="userEntry">
        <h4>Username: {data.username}</h4>
        <h4>
          Access Level: {data.access[0].toUpperCase() + data.access.substring(1)}
        </h4>
        <button onClick={()=>setShowDelete(true)}>Delete User</button>
        <button onClick={()=>setShowAccess(true)}>Edit User Access</button>
        {showDelete ? <div className="deleteUser">
          <h3>Delete this user?</h3>
          <button onClick={()=>executeDelete(data.username)}>Confirm</button>
          <button onClick={()=>setShowDelete(false)}>Cancel</button>
        </div> : ""}
        {showAccess ? <div className="editUser">
          <h3>Edit User Access</h3>
          <form>
          <select id="access" name="access">
            <option value="user">User</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
            </select>
          <input type="submit" value="Submit" onClick={(event)=>executeEdit(data.username, event)}/>
          </form>
          <button onClick={()=>setShowAccess(false)}>Cancel</button>
        </div> : ""}
      </div>
    );
}

export default function UserList({ loggedIn, setLoggedIn, accessLevel }) {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();
  
  async function fetchAllUsers() {
    const res = await fetch(config.BACKEND_URL + "admin/userindex", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.status === 200) {
      setUserData(result);
    } else if (res.status === 401) {
      setLoggedIn(false)
    } else {
      console.log(result);
    }
  }

  useEffect(() => {
    function checkLoginAccess() {
      if (!loggedIn || accessLevel !== "admin") {
        navigate("/login");
      }
    }
    checkLoginAccess();
    fetchAllUsers();
    // eslint-disable-next-line
  }, [accessLevel, loggedIn, setLoggedIn, navigate]);

  return (
    <>
      <h1>User List (admin only)</h1>
      {userData ? userData.map((data) => <UserEntry key={data.username} data={data} fetchAllUsers={fetchAllUsers}/>)  : ""}
    </>
  );
}
