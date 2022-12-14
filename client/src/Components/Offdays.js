import React, { useState, useEffect } from "react";
import config from "../config";
import Searchbar from "./Searchbar";

export default function Offdays({ loggedIn, accessLevel }) {
  const [offdayData, setOffdayData] = useState();
  const [newOffday, setNewOffday] = useState(false);
  const [category, setCategory] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (accessLevel === "staff" || accessLevel === "admin") {
      getOffdayData();
    }
    // eslint-disable-next-line
  }, [accessLevel]);

  async function getOffdayData() {
    const res = await fetch(config.BACKEND_URL + "offday", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.ok) {
      setOffdayData(result);
    } else if (res.status === 401) {
      console.log(result);
    }
  }

  return (
    <>
      {loggedIn ? (
        accessLevel === "staff" || accessLevel === "admin" ? (
          <>
            <h1>Offdays</h1>
            <div className="buttonContainer">
              <div id="buttonLeft">
                <button id="newEntry" onClick={() => setNewOffday(true)}>
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
            <Searchbar
              dataList={offdayData}
              setDataList={setOffdayData}
              setSearchQuery={setSearchQuery}
            />
            {offdayData ? (
              <OffdayList
                offdayData={offdayData}
                category={category}
                getOffdayData={getOffdayData}
                searchQuery={searchQuery}
              />
            ) : (
              <>
                <div className="loading" />
                <h1>Loading...</h1>
              </>
            )}
            {newOffday ? (
              <NewOffday
                setNewOffday={setNewOffday}
                getOffdayData={getOffdayData}
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

function OffdayList({ offdayData, category, getOffdayData, searchQuery }) {
  let myList = offdayData.map((data) => data);

  if (searchQuery) {
    myList = myList.filter((data) =>
      data.staffName.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
        <OffdayEntry key={data._id} data={data} getOffdayData={getOffdayData} />
      ))}
    </>
  );
}

export function OffdayEntry({ data, getOffdayData }) {
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
    const res = await fetch(config.BACKEND_URL + `offday/${data._id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dateTime: data.dateTime }),
    });
    if (res.ok) {
      getOffdayData();
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
          <div className="label">Staff</div>
          <div className="entryTextItem">{data.staffName}</div>
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
        <div className="entryTextGrid">
          <div className="label">Reason</div>
          <div className="entryTextItem">
            {data.reason ? data.reason : "N/A"}
          </div>
        </div>
      </div>
      {showDetails ? (
        <div className="modButtonContainer">
          <button className="modButton" onClick={() => setShowEdit(true)}>
            Edit
          </button>
          <button className="modButton" onClick={() => setShowDelete(true)}>
            Delete Offday
          </button>
          {showDelete ? (
            <div>
              <h3>Really delete this offday?</h3>
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
        <EditOffday
          data={data}
          getOffdayData={getOffdayData}
          setShowEdit={setShowEdit}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export function NewOffday({ setNewOffday, getOffdayData, defaultDate }) {
  const [errorMesssage, setErrorMessage] = useState();
  const [staffList, setStaffList] = useState();

  useEffect(() => {
    async function getStaffList() {
      const res = await fetch(config.BACKEND_URL + `admin/userindex`, {
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        result = result.filter(
          (data) => data.access === "admin" || data.access === "staff"
        );
        setStaffList(result);
      } else {
        console.log("Error retrieving staff list");
      }
    }
    getStaffList();
  }, []);

  let myDate = null;
  if (defaultDate) {
    myDate = defaultDate;
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

  async function createOffday(event) {
    event.preventDefault();
    if (!event.target.form[0].selectedOptions[0].value) {
      setErrorMessage("Required field: Staff");
    } else if (!event.target.form[1].value) {
      setErrorMessage("Required field: Date");
    } else {
      let formBody = {
        staff: event.target.form[0].selectedOptions[0].value,
        staffName: event.target.form[0].selectedOptions[0].text,
        dateTime: event.target.form[1].value,
        reason: event.target.form[2].value,
      };

      const res = await fetch(config.BACKEND_URL + "offday", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      });
      if (res.ok) {
        getOffdayData();
        setErrorMessage(false);
        setNewOffday(false);
      } else {
        setErrorMessage(await res.json());
      }
    }
  }

  return (
    <>
      <div
        onClick={() => setNewOffday(false)}
        className="modalBackground"
        style={{ zIndex: 39 }}
      />

      <div className="entryModal" style={{ zIndex: 40 }}>
        <h1>New Offday</h1>
        {errorMesssage ? <h3 style={{ color: "red" }}>{errorMesssage}</h3> : ""}
        <form className="entryForm">
          <div className="label">Staff</div>
          <select className="entryFormChild" id="staff" name="staff">
            {staffList
              ? staffList.map((data) => {
                  return (
                    <option key={data._id} value={data._id}>
                      {data.username}
                    </option>
                  );
                })
              : ""}
          </select>
          <div className="label">Date</div>
          <input
            className="entryFormChild"
            type="date"
            name="date"
            defaultValue={defaultDateTime}
          />
          <div className="label">Reason</div>
          <input className="entryFormChild" type="text" name="reason" />
          <input
            className="entryFormSubmit"
            style={{
              gridColumn: "1 / span 2",
              margin: "auto 20%",
              marginTop: "20px",
            }}
            type="submit"
            value="Submit"
            onClick={(event) => createOffday(event)}
          />
        </form>
        <button
          className="modButton"
          style={{ marginTop: "30px" }}
          onClick={() => setNewOffday(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

function EditOffday({ data, getOffdayData, setShowEdit }) {
  const [errorMesssage, setErrorMessage] = useState();
  const [staffList, setStaffList] = useState();

  useEffect(() => {
    async function getStaffList() {
      const res = await fetch(config.BACKEND_URL + `admin/userindex`, {
        credentials: "include",
      });
      let result = await res.json();
      if (res.ok) {
        result = result.filter(
          (data) => data.access === "admin" || data.access === "staff"
        );
        setStaffList(result);
      } else {
        console.log("Error retrieving staff list");
      }
    }
    getStaffList();
  }, []);

  async function submitEdit(event) {
    event.preventDefault();
    if (!event.target.form[0].selectedOptions[0].value) {
      setErrorMessage("Required field: Staff");
    } else if (!event.target.form[1].value) {
      setErrorMessage("Required field: Date");
    } else {
      let formBody = {
        staff: event.target.form[0].selectedOptions[0].value,
        staffName: event.target.form[0].selectedOptions[0].text,
        dateTime: new Date(event.target.form[1].value),
        reason: event.target.form[2].value,
      };
      const res = await fetch(config.BACKEND_URL + `offday/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      });
      if (res.ok) {
        getOffdayData();
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
        <h1>Edit Offday</h1>
        {errorMesssage ? <h3 style={{ color: "red" }}>{errorMesssage}</h3> : ""}
        <form className="entryForm">
          <div className="label">Staff</div>
          {staffList ? (
            <select
              className="entryFormChild"
              id="staff"
              name="staff"
              defaultValue={data.staff}
            >
              {staffList.map((staffData) => {
                return (
                  <option key={staffData._id} value={staffData._id}>
                    {staffData.username}
                  </option>
                );
              })}
            </select>
          ) : (
            ""
          )}
          <div className="label">Date</div>
          <input
            className="entryFormChild"
            type="date"
            name="date"
            defaultValue={defaultDateTime}
          />
          <div className="label">Reason</div>
          <input
            className="entryFormChild"
            type="text"
            name="reason"
            defaultValue={data.reason}
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
