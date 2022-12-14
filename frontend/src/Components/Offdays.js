import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";

export default function Offdays({ loggedIn, setLoggedIn, accessLevel }) {
  const navigate = useNavigate();
  const [offdayData, setOffdayData] = useState();
  const [newOffday, setNewOffday] = useState(false);
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
    getOffdayData();
    // eslint-disable-next-line
  }, [accessLevel, loggedIn, navigate, setLoggedIn]);

  async function getOffdayData() {
    const res = await fetch(config.BACKEND_URL + "offday", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.status === 200) {
      setOffdayData(result);
    } else if (res.status === 401) {
      console.log(result);
      setLoggedIn(false);
    }
  }

  return (
    <>
      <h1>Offdays</h1>
      <div>
        <button onClick={() => setNewOffday(true)}>Create new offday</button>
      </div>
      <button onClick={() => setCategory("upcoming")}>Upcoming</button>
      <button onClick={() => setCategory("complete")}>Complete</button>
      <button onClick={() => setCategory("all")}>All</button>
      {offdayData ? (
        <OffdayList
          offdayData={offdayData}
          category={category}
          getOffdayData={getOffdayData}
        />
      ) : (
        ""
      )}
      {newOffday ? (
        <NewOffday setNewOffday={setNewOffday} getOffdayData={getOffdayData} />
      ) : (
        ""
      )}
    </>
  );
}

function OffdayList({ offdayData, category, getOffdayData }) {
  let myList = offdayData.map((data) => data);

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

function OffdayEntry({ data, getOffdayData }) {
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
    if (res.status === 200) {
      getOffdayData();
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
        Staff: {data.staffName} | Date:
        {data.dateTime.toLocaleDateString("en-SG", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}{" "}
        | Reason: {data.reason ? data.reason : "N/A"}
      </p>
      {showDetails ? (
        <div>
          <button onClick={() => setShowEdit(true)}>Edit</button>
          <button onClick={() => setShowDelete(true)}>Delete Offday</button>
          {showDelete ? (
            <div>
              <p>Really delete this offday?</p>
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

function NewOffday({ setNewOffday, getOffdayData }) {
  const [errorMesssage, setErrorMessage] = useState();
  const [staffList, setStaffList] = useState();

  useEffect(() => {
    async function getStaffList() {
      const res = await fetch(config.BACKEND_URL + `admin/userindex`, {
        credentials: "include",
      });
      let result = await res.json();
      if (res.status === 200) {
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

  async function createOffday(event) {
    event.preventDefault();
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
    if (res.status === 200) {
      getOffdayData();
      setErrorMessage(false);
      setNewOffday(false);
    }
  }

  return (
    <>
      <div
        onClick={() => setNewOffday(false)}
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
        <h1>New Offday</h1>
        {errorMesssage ? <h4>{errorMesssage}</h4> : ""}
        <form>
          <div>
            <label htmlFor="staff">Staff : </label>
            <select id="staff" name="staff">
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
          </div>
          <div>
            <label htmlFor="date">Date: </label>
            <input type="date" name="date" defaultValue={defaultDateTime} />
          </div>
          <div>
            <label htmlFor="reason">Reason : </label>
            <input type="text" name="reason" />
          </div>
          <input
            type="submit"
            value="Submit"
            onClick={(event) => createOffday(event)}
          />
        </form>
        <button onClick={() => setNewOffday(false)}>Cancel</button>
      </div>
    </>
  );
}

function EditOffday({ data, getOffdayData, setShowEdit }) {
  const [staffList, setStaffList] = useState();

  useEffect(() => {
    async function getStaffList() {
      const res = await fetch(config.BACKEND_URL + `admin/userindex`, {
        credentials: "include",
      });
      let result = await res.json();
      if (res.status === 200) {
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
    if (res.status === 200) {
      getOffdayData();
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
        <h1>Edit Offday</h1>
        <form>
          <div>
            <label htmlFor="staff">Staff : </label>
            {staffList ? (
              <select id="staff" name="staff" defaultValue={data.staff}>
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
          </div>
          <div>
            <label htmlFor="date">Date: </label>
            <input type="date" name="date" defaultValue={defaultDateTime} />
          </div>
          <div>
            <label htmlFor="reason">Reason : </label>
            <input type="text" name="reason" defaultValue={data.reason} />
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
