import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Pickups({ loggedIn, setLoggedIn, accessLevel }) {
  const navigate = useNavigate();
  const [pickupData, setPickupData] = useState();
  const [newPickup, setNewPickup] = useState(false);
  const [category, setCategory] = useState("upcoming");

  useEffect(() => {
    function checkLoggedIn() {
      if (!loggedIn) {
        navigate("/login");
      }
    }
    function checkAccess() {
      if (accessLevel !== "staff" && accessLevel !== "admin") {
        navigate("/login");
      }
    }
    checkLoggedIn();
    checkAccess();
    getPickupData();
    // eslint-disable-next-line
  }, [accessLevel, loggedIn, navigate, setLoggedIn]);

  async function getPickupData() {
    const res = await fetch(config.BACKEND_URL + "pickup", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.status === 200) {
      setPickupData(result);
    } else if (res.status === 401) {
      console.log(result);
      setLoggedIn(false);
    }
  }

  return (
    <>
      <h1>Pickups</h1>
      <div>
        <button onClick={() => setNewPickup(true)}>Create new pickup</button>
      </div>
      <button onClick={() => setCategory("upcoming")}>Upcoming</button>
      <button onClick={() => setCategory("complete")}>Complete</button>
      <button onClick={() => setCategory("all")}>All</button>
      {pickupData ? (
        <PickupList
          pickupData={pickupData}
          category={category}
          getPickupData={getPickupData}
        />
      ) : (
        ""
      )}
      {newPickup ? (
        <NewPickup setNewPickup={setNewPickup} getPickupData={getPickupData} />
      ) : (
        ""
      )}
    </>
  );
}

function PickupList({ pickupData, category, getPickupData }) {
  let myList = pickupData.map((data) => data);

  if (category === "upcoming") {
    myList = myList.filter(
      (data) => new Date(data.dateTime).getTime() > new Date().getTime()
    );
  } else if (category === "complete") {
    myList = myList.filter(
      (data) => new Date(data.dateTime).getTime() <= new Date().getTime()
    );
  }

  return (
    <>
      {myList.map((data) => (
        <PickupEntry key={data._id} data={data} getPickupData={getPickupData} />
      ))}
    </>
  );
}

function PickupEntry({ data, getPickupData }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  function toggleDetails() {
    if (showDetails) {
      setShowDetails(false);
    } else {
      setShowDetails(true);
    }
  }

  async function deleteEntry() {
    const res = await fetch(config.BACKEND_URL + `pickup/${data._id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dateTime: data.dateTime }),
    });
    if (res.status === 200) {
      getPickupData();
      setShowDelete(false);
      setShowDetails(false);
    } else {
      console.log("Error: ", await res.json());
    }
  }

  data.dateTime = new Date(data.dateTime);

  return (
    <div style={{ border: "2px solid black" }}>
      <div onClick={toggleDetails}>Show</div>
      <p>
        Customer: {data.customer} | Date:{" "}
        {data.dateTime.toLocaleDateString("en-SG", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}{" "}
        | Time:{" "}
        {data.dateTime.toLocaleTimeString("en-SG", {
          hour: "2-digit",
          minute: "2-digit",
        })}
        | Item: {data.item ? data.item : "N/A"}
      </p>
      {showDetails ? (
        <div>
          <button onClick={() => setShowEdit(true)}>Edit</button>
          <button onClick={() => setShowDelete(true)}>Delete Pickup</button>
          {showDelete ? (
            <div>
              <p>Really delete this pickup?</p>
              <button onClick={deleteEntry}>Confirm</button>
              <button onClick={() => setShowDelete(false)}>Cancel</button>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
      {showEdit ? (
        <EditPickup
          data={data}
          getPickupData={getPickupData}
          setShowEdit={setShowEdit}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function NewPickup({ setNewPickup, getPickupData }) {
  const [errorMesssage, setErrorMessage] = useState();

  let myDate = new Date();
  let year = myDate.getFullYear();
  let month = (myDate.getMonth() + 1).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  let day = myDate
    .getDate()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  let defaultDateTime = year + "-" + month + "-" + day + "T00:00";

  async function createPickup(event) {
    event.preventDefault();
    let formBody = {
      customer: event.target.form[0].value,
      dateTime: event.target.form[1].value,
      item: event.target.form[2].value,
    };

    const res = await fetch(config.BACKEND_URL + "pickup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    if (res.status === 200) {
      getPickupData();
      setErrorMessage(false);
      setNewPickup(false);
    }
  }

  return (
    <>
      <div
        onClick={() => setNewPickup(false)}
        style={{
          backgroundColor: "grey",
          position: "fixed",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
          opacity: 0.5,
          zIndex: 10,
        }}
      />
      <div
        style={{
          backgroundColor: "white",
          position: "fixed",
          height: "60%",
          width: "500px",
          zIndex: 20,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1>New Pickup</h1>
        {errorMesssage ? <h4>{errorMesssage}</h4> : ""}
        <form>
          <div>
            <label htmlFor="customer">Customer: </label>
            <input type="text" name="customer" />
          </div>
          <div>
            <label htmlFor="date">Date: </label>
            <input
              type="datetime-local"
              name="date"
              defaultValue={defaultDateTime}
            />
          </div>
          <div>
            <label htmlFor="item">Item: </label>
            <input type="text" name="item" />
          </div>
          <input
            type="submit"
            value="Submit"
            onClick={(event) => createPickup(event)}
          />
        </form>
        <button onClick={() => setNewPickup(false)}>Cancel</button>
      </div>
    </>
  );
}

function EditPickup({ data, getPickupData, setShowEdit }) {
  async function submitEdit(event) {
    event.preventDefault();
    let formBody = {
      customer: event.target.form[0].value,
      dateTime: event.target.form[1].value,
      item: event.target.form[2].value,
    };
    const res = await fetch(config.BACKEND_URL + `pickup/${data._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    if (res.status === 200) {
      getPickupData();
      setShowEdit(false);
    } else {
      console.log("Error: ", await res.json());
    }
  }

  let dateTime = new Date(data.dateTime);
  let year = dateTime.getFullYear();
  let month = (dateTime.getMonth() + 1).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  let day = dateTime
    .getDate()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  let hour = dateTime
    .getHours()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  let minute = dateTime
    .getMinutes()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  let defaultDateTime =
    year + "-" + month + "-" + day + "T" + hour + ":" + minute;

  return (
    <>
      <div
        onClick={() => setShowEdit(false)}
        style={{
          backgroundColor: "grey",
          position: "fixed",
          height: "100%",
          width: "100%",
          top: 0,
          left: 0,
          opacity: 0.5,
          zIndex: 10,
        }}
      />
      <div
        style={{
          backgroundColor: "white",
          position: "fixed",
          height: "60%",
          width: "500px",
          zIndex: 20,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h1>Edit Pickup</h1>
        <form>
          <div>
            <label htmlFor="customer">Customer: </label>
            <input type="text" name="customer" defaultValue={data.customer} />
          </div>
          <div>
            <label htmlFor="date">Date / Time: </label>
            <input
              type="datetime-local"
              name="date"
              defaultValue={defaultDateTime}
            />
          </div>
          <div>
            <label htmlFor="item">Item: </label>
            <input type="text" name="item" defaultValue={data.item} />
          </div>
          <input
            type="submit"
            value="Submit"
            onClick={(event) => submitEdit(event)}
          />
        </form>
        <button onClick={() => setShowEdit(false)}>Cancel</button>
      </div>
    </>
  );
}
