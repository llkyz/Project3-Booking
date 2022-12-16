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
      <div className="buttonContainer">
        <div id="buttonLeft">
          <button id="newEntry" onClick={() => setNewHoliday(true)}>
            CREATE NEW
          </button>
        </div>
        <div id="buttonRight">
          <button
            className={
              category === "upcoming" ? "filterButtonSelected" : "filterButton"
            }
            onClick={() => setCategory("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={
              category === "complete" ? "filterButtonSelected" : "filterButton"
            }
            onClick={() => setCategory("complete")}
          >
            Complete
          </button>
          <button
            className={
              category === "all" ? "filterButtonSelected" : "filterButton"
            }
            onClick={() => setCategory("all")}
          >
            All
          </button>
        </div>
      </div>
      {holidayData ? (
        <HolidayList
          holidayData={holidayData}
          category={category}
          getHolidayData={getHolidayData}
        />
      ) : (
        <>
          <div className="loading" />
          <h1>Loading...</h1>
        </>
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
    if (res.status === 200) {
      getHolidayData();
      setShowDelete(false);
      setShowDetails(false);
    } else {
      console.log("Error: ", await res.json());
    }
  }

  data.dateTime = new Date(data.dateTime);

  return (
    <div className="entry">
      <div className="arrowContainer" onClick={toggleDetails}>
        <div className={showDetails ? "showLessButton" : "showMoreButton"} />
      </div>
      <div className="entryTextGrid" style={{ marginLeft: "7%" }}>
        <div className="entryTextGrid">
          <div className="label">Title</div>
          <div className="entryTextItem">{data.title}</div>
          <div className="label">Date</div>
          <div className="entryTextItem">
            {data.dateTime.toLocaleDateString("en-SG", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
      {showDetails ? (
        <div className="modButtonContainer">
          <button className="modButton" onClick={() => setShowEdit(true)}>
            Edit
          </button>
          <button className="modButton" onClick={() => setShowDelete(true)}>
            Delete Holiday
          </button>
          {showDelete ? (
            <div>
              <h3>Really delete this holiday?</h3>
              <button className="modButton" onClick={deleteEntry}>
                Confirm
              </button>
              <button
                className="modButton"
                onClick={() => setShowDelete(false)}
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
  let defaultDateTime = year + "-" + month + "-" + day;

  async function createHoliday(event) {
    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Required field: Title");
    } else if (!event.target.form[1].value) {
      setErrorMessage("Required field: Date");
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
      } else {
        setErrorMessage(await res.json());
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

      <div className="entryModal">
        <h1>New Holiday</h1>
        {errorMesssage ? <h3 style={{ color: "red" }}>{errorMesssage}</h3> : ""}
        <form className="entryForm">
          <div className="label">Title*</div>
          <input className="entryFormChild" type="text" name="title" />
          <div className="label">Date</div>
          <input
            className="entryFormChild"
            type="date"
            name="date"
            defaultValue={defaultDateTime}
          />
          <input
            className="entryFormSubmit"
            style={{
              gridColumn: "1 / span 2",
              margin: "auto 20%",
              marginTop: "20px",
            }}
            type="submit"
            value="Submit"
            onClick={(event) => createHoliday(event)}
          />
        </form>
        <button
          className="modButton"
          style={{ marginTop: "30px" }}
          onClick={() => setNewHoliday(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

function EditHoliday({ data, getHolidayData, setShowEdit }) {
  const [errorMesssage, setErrorMessage] = useState();

  async function submitEdit(event) {
    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Required field: Title");
    } else if (!event.target.form[1].value) {
      setErrorMessage("Required field: Date");
    } else {
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
      if (res.status === 200) {
        getHolidayData();
        setShowEdit(false);
      } else {
        setErrorMessage(await res.json());
      }
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

      <div className="entryModal">
        <h1>Edit Holiday</h1>
        {errorMesssage ? <h3 style={{ color: "red" }}>{errorMesssage}</h3> : ""}
        <form className="entryForm">
          <div className="label">Title*</div>
          <input
            className="entryFormChild"
            type="text"
            name="title"
            defaultValue={data.title}
          />
          <div className="label">Date</div>
          <input
            className="entryFormChild"
            type="date"
            name="date"
            defaultValue={defaultDateTime}
          />
          <input
            className="entryFormSubmit"
            style={{
              gridColumn: "1 / span 2",
              margin: "auto 20%",
              marginTop: "20px",
            }}
            type="submit"
            value="Submit"
            onClick={(event) => submitEdit(event)}
          />
        </form>
        <button
          className="modButton"
          style={{ marginTop: "30px" }}
          onClick={() => setShowEdit(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
