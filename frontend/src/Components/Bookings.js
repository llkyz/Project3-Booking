import React, { useState, useEffect } from "react";
import config from "../config";

export default function Bookings({ loggedIn, accessLevel }) {
  const [bookingData, setBookingData] = useState();
  const [newBooking, setNewBooking] = useState(false);
  const [category, setCategory] = useState("open");

  useEffect(() => {
    if (accessLevel === "staff" || accessLevel === "admin") {
      getBookingData();
    }
    // eslint-disable-next-line
  }, [accessLevel]);

  async function getBookingData() {
    const res = await fetch(config.BACKEND_URL + "booking", {
      method: "GET",
      credentials: "include",
    });
    let result = await res.json();
    if (res.status === 200) {
      setBookingData(result);
    } else {
      console.log(result);
    }
  }

  return (
    <>
      {loggedIn ? (
        accessLevel === "staff" || accessLevel === "admin" ? (
          <>
            <h1>Bookings</h1>
            <div className="buttonContainer">
              <div id="buttonLeft">
                <button id="newEntry" onClick={() => setNewBooking(true)}>
                  CREATE NEW
                </button>
              </div>
              <div id="buttonRight">
                <button
                  className={
                    category === "open"
                      ? "filterButtonSelected"
                      : "filterButton"
                  }
                  onClick={() => setCategory("open")}
                >
                  Open
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
                <button
                  className={
                    category === "ignored"
                      ? "filterButtonSelected"
                      : "filterButton"
                  }
                  onClick={() => setCategory("ignored")}
                >
                  Ignored
                </button>
              </div>
            </div>
            {bookingData ? (
              <BookingList
                bookingData={bookingData}
                category={category}
                getBookingData={getBookingData}
              />
            ) : (
              <>
                <div className="loading" />
                <h1>Loading...</h1>
              </>
            )}
            {newBooking ? (
              <NewBooking
                setNewBooking={setNewBooking}
                getBookingData={getBookingData}
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

function BookingList({ bookingData, category, getBookingData }) {
  let myList = bookingData.map((data) => data);

  if (category === "all") {
    myList = myList.filter((data) => data.ignore === false);
  } else if (category === "open") {
    myList = myList.filter(
      (data) => data.complete === false && data.ignore === false
    );
  } else if (category === "complete") {
    myList = myList.filter(
      (data) => data.complete === true && data.ignore === false
    );
  } else if (category === "ignored") {
    myList = myList.filter((data) => data.ignore === true);
  }

  return (
    <>
      {myList.map((data) => (
        <BookingEntry
          key={data._id}
          data={data}
          getBookingData={getBookingData}
        />
      ))}
    </>
  );
}

export function BookingEntry({ data, getBookingData }) {
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

  data.dateTime = new Date(data.dateTime);

  async function setComplete(condition) {
    const res = await fetch(config.BACKEND_URL + `booking/${data._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateTime: data.dateTime,
        complete: condition,
      }),
    });
    if (res.status === 200) {
      getBookingData();
      setShowDelete(false);
      setShowDetails(false);
    } else {
      console.log("Error: ", await res.json());
    }
  }

  async function setIgnore(condition) {
    const res = await fetch(config.BACKEND_URL + `booking/${data._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dateTime: data.dateTime,
        ignore: condition,
      }),
    });
    if (res.status === 200) {
      getBookingData();
      setShowDelete(false);
      setShowDetails(false);
    } else {
      console.log("Error: ", await res.json());
    }
  }

  async function deleteEntry() {
    const res = await fetch(config.BACKEND_URL + `booking/${data._id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dateTime: data.dateTime }),
    });
    if (res.status === 200) {
      getBookingData();
      setShowDelete(false);
      setShowDetails(false);
    } else {
      console.log("Error: ", await res.json());
    }
  }

  return (
    <div className="entry">
      <div className="arrowContainer" onClick={toggleDetails}>
        <div className={showDetails ? "showLessButton" : "showMoreButton"} />
      </div>
      <div className="entryTextGrid" style={{ marginLeft: "7%" }}>
        <div className="entryTextGrid">
          <div className="label">Customer</div>
          <div className="entryTextItem">{data.customer}</div>
          <div className="label">Contact</div>
          <div className="entryTextItem">{data.contact ?? "N/A"}</div>
        </div>
        <div className="entryTextGrid">
          <div className="label">Date</div>
          <div className="entryTextItem">
            {data.dateTime.toLocaleDateString("en-SG", {
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
        <div className="entryDetails">
          <div className="entryTextGrid" style={{ marginLeft: "7%" }}>
            <div className="entryTextGrid">
              <div className="label">Price</div>
              <div className="entryTextItem">
                {data.price ? "$" + data.price.toFixed(2) : "N/A"}
              </div>
              <div className="label">Participants</div>
              <div className="entryTextItem">{data.participants ?? "N/A"}</div>
            </div>
            <div className="entryTextGrid">
              <div className="label">Origin</div>
              <div className="entryTextItem">
                {data.origin[0].toUpperCase() + data.origin.substring(1)}
              </div>
              <div className="label">ID</div>
              <div className="entryTextItem">{data.id ?? "N/A"}</div>
            </div>
          </div>
          <div className="modButtonContainer">
            <button className="modButton" onClick={() => setShowEdit(true)}>
              Edit
            </button>
            {data.complete === false && data.ignore === false ? (
              <button className="modButton" onClick={() => setComplete(true)}>
                Add to Complete
              </button>
            ) : (
              <button className="modButton" onClick={() => setComplete(false)}>
                Set to Open
              </button>
            )}
            {data.ignore === false ? (
              <button className="modButton" onClick={() => setIgnore(true)}>
                Add to Ignore
              </button>
            ) : (
              <button className="modButton" onClick={() => setIgnore(false)}>
                Remove from Ignore
              </button>
            )}
            <button className="modButton" onClick={() => setShowDelete(true)}>
              Delete Entry
            </button>
            {showDelete ? (
              <div>
                <h3>Really delete this entry?</h3>
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
        </div>
      ) : (
        ""
      )}
      {showEdit ? (
        <EditBooking
          data={data}
          getBookingData={getBookingData}
          setShowEdit={setShowEdit}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export function NewBooking({ setNewBooking, getBookingData }) {
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

  async function createBooking(event) {
    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Required field: Customer");
    } else if (!event.target.form[2].value) {
      setErrorMessage("Required field: Date / Time");
    } else {
      let formBody = {};
      formBody.customer = event.target.form[0].value;
      if (event.target.form[1].value) {
        formBody.contact = event.target.form[1].value;
      }
      formBody.dateTime = event.target.form[2].value;
      if (event.target.form[3].value) {
        formBody.price = event.target.form[3].value;
      }
      if (event.target.form[4].value) {
        formBody.participants = event.target.form[4].value;
      }
      formBody.origin = "manual";
      if (event.target.form[6].value) {
        formBody.id = event.target.form[6].value;
      }
      formBody.complete = event.target.form[7].checked;
      formBody.ignore = event.target.form[8].checked;
      const res = await fetch(config.BACKEND_URL + "booking", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      });
      if (res.status === 200) {
        getBookingData();
        setErrorMessage(false);
        setNewBooking(false);
      } else {
        setErrorMessage(await res.json());
      }
    }
  }

  return (
    <>
      <div
        onClick={() => setNewBooking(false)}
        className="modalBackground"
        style={{ zIndex: 39 }}
      />

      <div className="entryModal" style={{ zIndex: 40 }}>
        <h1>New Booking</h1>
        {errorMesssage ? <h3 style={{ color: "red" }}>{errorMesssage}</h3> : ""}
        <form className="entryForm">
          <div className="label">Customer*</div>
          <input className="entryFormChild" type="text" name="customer" />
          <div className="label">Contact</div>
          <input className="entryFormChild" type="text" name="contact" />
          <div className="label">Date / Time</div>
          <input
            className="entryFormChild"
            type="datetime-local"
            name="date"
            defaultValue={defaultDateTime}
          />
          <div className="label">Price</div>
          <input className="entryFormChild" type="number" name="price" />
          <div className="label">Participants</div>
          <input className="entryFormChild" type="number" name="participants" />
          <div className="label">Origin</div>
          <input
            className="entryFormChild"
            type="text"
            name="origin"
            defaultValue="Manual"
            disabled
          />
          <div className="label">ID</div>
          <input className="entryFormChild" type="number" name="id" />
          <div className="label">Complete</div>
          <input className="entryFormChild" type="checkbox" name="complete" />
          <div className="label">Ignore</div>
          <input className="entryFormChild" type="checkbox" name="ignore" />
          <input
            className="entryFormSubmit"
            style={{
              gridColumn: "1 / span 2",
              margin: "auto 20%",
              marginTop: "20px",
            }}
            type="submit"
            value="Submit"
            onClick={(event) => createBooking(event)}
          />
        </form>
        <button
          className="modButton"
          style={{ marginTop: "30px" }}
          onClick={() => setNewBooking(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

function EditBooking({ data, getBookingData, setShowEdit }) {
  const [errorMesssage, setErrorMessage] = useState();

  async function submitEdit(event) {
    event.preventDefault();
    if (!event.target.form[0].value) {
      setErrorMessage("Required field: Customer");
    } else if (!event.target.form[2].value) {
      setErrorMessage("Required field: Date / Time");
    } else {
      let formBody = {
        customer: event.target.form[0].value,
        contact: event.target.form[1].value,
        dateTime: new Date(event.target.form[2].value),
        price: event.target.form[3].value,
        participants: event.target.form[4].value,
        origin: event.target.form[5].value,
        id: event.target.form[6].value,
        complete: event.target.form[7].checked,
        ignore: event.target.form[8].checked,
      };
      const res = await fetch(config.BACKEND_URL + `booking/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formBody),
      });
      if (res.status === 200) {
        getBookingData();
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
        <h1>Edit Booking</h1>
        {errorMesssage ? <h3 style={{ color: "red" }}>{errorMesssage}</h3> : ""}
        <form className="entryForm">
          <div className="label">Customer*</div>
          <input
            className="entryFormChild"
            type="text"
            name="customer"
            defaultValue={data.customer}
          />
          <div className="label">Contact</div>
          <input
            className="entryFormChild"
            type="text"
            name="contact"
            defaultValue={data.contact}
          />
          <div className="label">Date / Time</div>
          <input
            className="entryFormChild"
            type="datetime-local"
            name="date"
            defaultValue={defaultDateTime}
          />
          <div className="label">Price</div>
          <input
            className="entryFormChild"
            type="number"
            name="price"
            defaultValue={data.price}
          />
          <div className="label">Participants</div>
          <input
            className="entryFormChild"
            type="number"
            name="participants"
            defaultValue={data.participants}
          />
          <div className="label">Origin</div>
          <input
            className="entryFormChild"
            type="text"
            name="origin"
            defaultValue={data.origin}
            disabled
          />
          <div className="label">ID</div>
          <input
            className="entryFormChild"
            type="number"
            name="id"
            defaultValue={data.id}
          />
          <div className="label">Complete</div>
          <input
            className="entryFormChild"
            type="checkbox"
            name="complete"
            defaultChecked={data.complete ?? ""}
          />
          <div className="label">Ignore</div>
          <input
            className="entryFormChild"
            type="checkbox"
            name="ignore"
            defaultChecked={data.ignore ?? ""}
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
