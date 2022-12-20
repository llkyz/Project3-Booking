import React, { useState, useEffect } from "react";
import config from "../config";
import Searchbar from "./Searchbar";

export default function Pickups({ loggedIn, accessLevel }) {
  const [pickupData, setPickupData] = useState();
  const [newPickup, setNewPickup] = useState(false);
  const [category, setCategory] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (accessLevel === "staff" || accessLevel === "admin") {
      getPickupData();
    }
    // eslint-disable-next-line
  }, [accessLevel]);

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
    }
  }

  return (
    <>
      {loggedIn ? (
        accessLevel === "staff" || accessLevel === "admin" ? (
          <>
            <h1>Pickups</h1>
            <div className="buttonContainer">
              <div id="buttonLeft">
                <button id="newEntry" onClick={() => setNewPickup(true)}>
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
            <Searchbar dataList={pickupData} setDataList={setPickupData} setSearchQuery={setSearchQuery}/>
            {pickupData ? (
              <PickupList
                pickupData={pickupData}
                category={category}
                getPickupData={getPickupData}
                searchQuery={searchQuery}
              />
            ) : (
              <>
                <div className="loading" />
                <h1>Loading...</h1>
              </>
            )}
            {newPickup ? (
              <NewPickup
                setNewPickup={setNewPickup}
                getPickupData={getPickupData}
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

function PickupList({ pickupData, category, getPickupData, searchQuery }) {
  let myList = pickupData.map((data) => data);

  if (searchQuery) {
    myList = myList.filter((data) => data.customer.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <PickupEntry key={data._id} data={data} getPickupData={getPickupData} />
      ))}
    </>
  );
}

export function PickupEntry({ data, getPickupData }) {
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

  let timezoneOffset = new Date().getTimezoneOffset()
  let offsetDate = new Date(data.dateTime.getTime() + timezoneOffset * 60000)

  return (
    <div className="entry">
      <div className="arrowContainer" onClick={toggleDetails}>
        <div className={showDetails ? "showLessButton" : "showMoreButton"} />
      </div>

      <div className="entryTextGrid" style={{ marginLeft: "7%" }}>
        <div className="entryTextGrid">
          <div className="label">Customer</div>
          <div className="entryTextItem">{data.customer}</div>
          <div className="label">Item</div>
          <div className="entryTextItem">{data.item ? data.item : "N/A"}</div>
        </div>
        <div className="entryTextGrid">
          <div className="label">Date</div>
          <div className="entryTextItem">
            {offsetDate.toLocaleDateString("en-SG", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="label">Time</div>
          <div className="entryTextItem">
            {data.dateTime.toLocaleTimeString("en-SG", {
              hour: "2-digit",
              minute: "2-digit",
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
            Delete Pickup
          </button>
          {showDelete ? (
            <div>
              <h3>Really delete this pickup?</h3>
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

export function NewPickup({ setNewPickup, getPickupData, defaultDate }) {
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
  let defaultDateTime = year + "-" + month + "-" + day + "T00:00";

  async function createPickup(event) {
    let oldDate = new Date(event.target.form[1].value)
    let timezoneOffset = oldDate.getTimezoneOffset()
    let offsetDate = new Date(oldDate - timezoneOffset * 60000)

    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Required field: Customer");
    } else if (!event.target.form[1].value) {
      setErrorMessage("Required field: Date / Time");
    } else {
      let formBody = {
        customer: event.target.form[0].value,
        dateTime: offsetDate,
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
      } else {
        setErrorMessage(await res.json());
      }
    }
  }

  return (
    <>
      <div
        onClick={() => setNewPickup(false)}
        className="modalBackground"
        style={{ zIndex: 39 }}
      />

      <div className="entryModal" style={{ zIndex: 40 }}>
        <h1>New Pickup</h1>
        {errorMesssage ? <h3 style={{ color: "red" }}>{errorMesssage}</h3> : ""}
        <form className="entryForm">
          <div className="label">Customer*</div>
          <input className="entryFormChild" type="text" name="customer" />
          <div className="label">Date / Time</div>
          <input
            className="entryFormChild"
            type="datetime-local"
            name="date"
            defaultValue={defaultDateTime}
          />
          <div className="label">Item</div>
          <input className="entryFormChild" type="text" name="item" />
          <input
            className="entryFormSubmit"
            style={{
              gridColumn: "1 / span 2",
              margin: "auto 20%",
              marginTop: "20px",
            }}
            type="submit"
            value="Submit"
            onClick={(event) => createPickup(event)}
          />
        </form>
        <button
          className="modButton"
          style={{ marginTop: "30px" }}
          onClick={() => setNewPickup(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

function EditPickup({ data, getPickupData, setShowEdit }) {
  const [errorMesssage, setErrorMessage] = useState();

  async function submitEdit(event) {
    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Required field: Customer");
    } else if (!event.target.form[1].value) {
      setErrorMessage("Required field: Date / Time");
    } else {
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
      <div onClick={() => setShowEdit(false)} className="modalBackground" />

      <div className="entryModal">
        <h1>Edit Pickup</h1>
        {errorMesssage ? <h3 style={{ color: "red" }}>{errorMesssage}</h3> : ""}
        <form className="entryForm">
          <div className="label">Customer*</div>
          <input
            className="entryFormChild"
            type="text"
            name="title"
            defaultValue={data.customer}
          />
          <div className="label">Date / Time</div>
          <input
            className="entryFormChild"
            type="datetime-local"
            name="date"
            defaultValue={defaultDateTime}
          />
          <div className="label">Item</div>
          <input
            className="entryFormChild"
            type="text"
            name="title"
            defaultValue={data.item}
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
