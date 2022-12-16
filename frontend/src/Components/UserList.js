import React, { useState, useEffect } from "react";
import config from "../config";

function UserEntry({ data, fetchAllUsers }) {
  const [showDelete, setShowDelete] = useState(false);
  const [showAccess, setShowAccess] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  async function executeDelete(username) {
    let formBody = { username: username };
    const res = await fetch(config.BACKEND_URL + "user", {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    if (res.status !== 200) {
      console.log(await res.json());
    } else {
      fetchAllUsers();
    }
  }

  async function executeEdit(username, event) {
    event.preventDefault();
    let formBody = {
      username: username,
      access: event.target.form[0].value,
    };
    const res = await fetch(config.BACKEND_URL + "user", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    if (res.status !== 200) {
      console.log(await res.json());
    } else {
      fetchAllUsers();
      setShowAccess(false);
    }
  }

  function toggleDetails() {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  }

  function toggleDelete() {
    if (showDelete) {
      setShowDelete(false);
    } else {
      setShowDelete(true);
    }
  }

  function toggleAccess() {
    if (showAccess) {
      setShowAccess(false);
    } else {
      setShowAccess(true);
    }
  }

  return (
    <div className="entry">
      <div
        className="arrowContainer"
        style={{ marginTop: "0px" }}
        onClick={toggleDetails}
      >
        <div className={showDetails ? "showLessButton" : "showMoreButton"} />
      </div>

      <div className="entryTextGrid" style={{ marginLeft: "7%" }}>
        <div className="entryTextGrid">
          <div className="label">Username</div>
          <div className="entryTextItem">{data.username}</div>
        </div>
        <div className="entryTextGrid">
          <div className="label">Access Level</div>
          <div className="entryTextItem">
            {data.access[0].toUpperCase() + data.access.substring(1)}
          </div>
        </div>
      </div>
      {showDetails ? (
        <div className="modButtonContainer">
          <button
            className="modButton"
            onClick={() => {
              toggleDelete();
              setShowAccess(false);
            }}
          >
            Delete User
          </button>
          <button
            className="modButton"
            onClick={() => {
              toggleAccess();
              setShowDelete(false);
            }}
          >
            Edit User Access
          </button>
          {showDelete ? (
            <div className="deleteUser">
              <h3>Delete this user?</h3>
              <button
                className="modButton"
                onClick={() => executeDelete(data.username)}
              >
                Confirm
              </button>
              <button className="modButton" onClick={() => toggleDelete()}>
                Cancel
              </button>
            </div>
          ) : (
            ""
          )}
          {showAccess ? (
            <div className="editUser">
              <h3>Edit User Access</h3>
              <form>
                <select
                  id="access"
                  name="access"
                  defaultValue={data.access}
                  style={{ fontSize: "1.1em" }}
                >
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  className="modButton"
                  type="submit"
                  value="Submit"
                  onClick={(event) => executeEdit(data.username, event)}
                />
              </form>
              <button
                className="modButton"
                style={{ marginTop: "10px" }}
                onClick={() => toggleAccess()}
              >
                Cancel
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default function UserList({ loggedIn, accessLevel }) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    if (accessLevel === "admin") {
      fetchAllUsers();
    }
    // eslint-disable-next-line
  }, [accessLevel]);

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

  return (
    <>
      {loggedIn ? (
        accessLevel === "staff" || accessLevel === "admin" ? (
          <>
            <h1 style={{ marginBottom: "30px" }}>User List</h1>
            {userData ? (
              userData.map((data) => (
                <UserEntry
                  key={data.username}
                  data={data}
                  fetchAllUsers={fetchAllUsers}
                />
              ))
            ) : (
              <>
                <div className="loading" />
                <h1>Loading...</h1>
              </>
            )}
          </>
        ) : (
          <h1>Insufficient user access</h1>
        )
      ) : (
        ""
      )}
    </>
  );
}
