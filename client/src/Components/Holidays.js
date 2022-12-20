import React, { useState, useEffect } from "react";
import config from "../config";
import Searchbar from "./Searchbar";

export default function Holidays({ loggedIn, accessLevel }) {
  const [holidayData, setHolidayData] = useState();
  const [newHoliday, setNewHoliday] = useState(false);
  const [category, setCategory] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (accessLevel === "staff" || accessLevel === "admin") {
      getHolidayData();
    }
    // eslint-disable-next-line
  }, [accessLevel]);

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
    }
  }

  return (
    <>
      {loggedIn ? (
        accessLevel === "staff" || accessLevel === "admin" ? (
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
                    category === "upcoming"
                      ? "filterButtonSelected"
                      : "filterButton"
                  }
                  onClick={() => setCategory("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={
                    category === "complete"
                      ? "filterButtonSelected"
                      : "filterButton"
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
            <Searchbar dataList={holidayData} setDataList={setHolidayData} setSearchQuery={setSearchQuery}/>
            {holidayData ? (
              <HolidayList
                holidayData={holidayData}
                category={category}
                getHolidayData={getHolidayData}
                searchQuery={searchQuery}
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
        ) : (
          <h1>Insufficient user access</h1>
        )
      ) : (
        ""
      )}
    </>
  );
}

function HolidayList({ holidayData, category, getHolidayData, searchQuery }) {
  let myList = holidayData.map((data) => data);

  if (searchQuery) {
    myList = myList.filter((data) => data.title.toLowerCase().includes(searchQuery.toLowerCase()))
  }

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

export function HolidayEntry({ data, getHolidayData }) {
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

  let timezoneOffset = new Date().getTimezoneOffset()
  let offsetDate = new Date(data.dateTime.getTime() + timezoneOffset * 60000)

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
            {offsetDate.toLocaleDateString("en-SG", {
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

export function NewHoliday({ setNewHoliday, getHolidayData, defaultDate }) {
  const [errorMesssage, setErrorMessage] = useState();

  let myDate = null
  if (defaultDate) {
    myDate = defaultDate
  } else {
    myDate = new Date();
  }
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
    let oldDate = new Date(event.target.form[1].value)
    let timezoneOffset = oldDate.getTimezoneOffset()
    let offsetDate = new Date(oldDate - timezoneOffset * 60000)

    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Required field: Title");
    } else if (!event.target.form[1].value) {
      setErrorMessage("Required field: Date");
    } else {
      let formBody = {};
      formBody.title = event.target.form[0].value;
      formBody.dateTime = offsetDate;
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
        className="modalBackground"
        style={{ zIndex: 39 }}
      />

      <div className="entryModal" style={{ zIndex: 40 }}>
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
      <div onClick={() => setShowEdit(false)} className="modalBackground" />

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
