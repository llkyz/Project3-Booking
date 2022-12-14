import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Holidays({ loggedIn, setLoggedIn, accessLevel }) {
  const navigate = useNavigate();
  const [holidayData, setHolidayData] = useState();
  const [newHoliday, setNewHoliday] = useState(false);
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
    getHolidayData();
    // eslint-disable-next-line
  }, [accessLevel, loggedIn, navigate, setLoggedIn]);

  async function getHolidayData() {
    const res = await fetch(config.BACKEND_URL + "holiday", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.status === 200) {
      setHolidayData(result);
    } else if (res.status === 401) {
      console.log(result);
      setLoggedIn(false);
    }
  }

  return (
    <>
      <h1>Holidays</h1>
      <div>
        <button onClick={() => setNewHoliday(true)}>Create new holiday</button>
      </div>
      <button onClick={() => setCategory("upcoming")}>Upcoming</button>
      <button onClick={() => setCategory("complete")}>Complete</button>
      <button onClick={() => setCategory("all")}>All</button>
      {holidayData ? (
        <HolidayList
          holidayData={holidayData}
          category={category}
          getHolidayData={getHolidayData}
        />
      ) : (
        ""
      )}
      {newHoliday ? (
        <NewHoliday
          setNewHoliday={setNewHoliday}
          getHolidayData={getHolidayData}
        />
      ) : (
        ""
      )}
    </>
  );
}

function HolidayList({ holidayData, category, getHolidayData }) {
  let myList = holidayData.map((data) => data);

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
        <HolidayEntry
          key={data._id}
          data={data}
          getHolidayData={getHolidayData}
        />
      ))}
    </>
  );
}

function HolidayEntry({ data, getHolidayData }) {
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
    const res = await fetch(config.BACKEND_URL + `holiday/${data._id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dateTime: data.dateTime }),
    });
    let result = await res.json();
    console.log(`Response ${res.status}: ${result}`);
    if (res.status === 200) {
      getHolidayData();
      setShowDelete(false);
      setShowDetails(false);
    }
  }

  data.dateTime = new Date(data.dateTime);

  return (
    <div style={{ border: "2px solid black" }}>
      <div onClick={toggleDetails}>Show</div>
      <p>
        Title: {data.title} | Date:{" "}
        {data.dateTime.toLocaleDateString("en-SG", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </p>
      {showDetails ? (
        <div>
          <button onClick={() => setShowEdit(true)}>Edit</button>
          <button onClick={() => setShowDelete(true)}>Delete Holiday</button>
          {showDelete ? (
            <div>
              <p>Really delete this holiday?</p>
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
        <EditHoliday
          data={data}
          getHolidayData={getHolidayData}
          setShowEdit={setShowEdit}
        />
      ) : (
        ""
      )}
    </div>
  );
}

function NewHoliday({ setNewHoliday, getHolidayData }) {
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

  async function createHoliday(event) {
    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Holiday title is required");
    } else {
      let formBody = {};
      formBody.title = event.target.form[0].value;
      formBody.dateTime = event.target.form[1].value;
      const res = await fetch(config.BACKEND_URL + "holiday", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      });
      if (res.status === 200) {
        getHolidayData();
        setErrorMessage(false);
        setNewHoliday(false);
      }
    }
  }

  return (
    <>
      <div
        onClick={() => setNewHoliday(false)}
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
        <h1>New Holiday</h1>
        {errorMesssage ? <h4>{errorMesssage}</h4> : ""}
        <form>
          <div>
            <label htmlFor="title">Title* : </label>
            <input type="text" name="title" />
          </div>
          <div>
            <label htmlFor="date">Date: </label>
            <input type="date" name="date" defaultValue={defaultDateTime} />
          </div>
          <input
            type="submit"
            value="Submit"
            onClick={(event) => createHoliday(event)}
          />
        </form>
        <button onClick={() => setNewHoliday(false)}>Cancel</button>
      </div>
    </>
  );
}

function EditHoliday({ data, getHolidayData, setShowEdit }) {
  async function submitEdit(event) {
    event.preventDefault();
    let formBody = {
      title: event.target.form[0].value,
      dateTime: new Date(event.target.form[1].value),
    };
    const res = await fetch(config.BACKEND_URL + `holiday/${data._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formBody),
    });
    let result = await res.json();
    console.log(`Response ${res.status}: ${result}`);
    if (res.status === 200) {
      getHolidayData();
      setShowEdit(false);
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
  let defaultDateTime = year + "-" + month + "-" + day;

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
        <h1>Edit Holiday</h1>
        <form>
          <div>
            <label htmlFor="title">Title: </label>
            <input type="text" name="title" defaultValue={data.title} />
          </div>
          <div>
            <label htmlFor="date">Date: </label>
            <input type="date" name="date" defaultValue={defaultDateTime} />
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
