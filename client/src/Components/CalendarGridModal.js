import React, { useState, useEffect } from "react";
import config from "../config";
import { BookingEntry, NewBooking } from "./Bookings";
import { HolidayEntry, NewHoliday } from "./Holidays";
import { OffdayEntry, NewOffday } from "./Offdays";
import { PickupEntry, NewPickup } from "./Pickups";

export default function CalendarGridModal({
  modalDate,
  setModalDate,
  getMonthEntries,
}) {
  const [entryData, setEntryData] = useState();
  const [bookingData, setBookingData] = useState([]);
  const [holidayData, setHolidayData] = useState([]);
  const [offdayData, setOffdayData] = useState([]);
  const [pickupData, setPickupData] = useState([]);
  const [createNew, setCreateNew] = useState();

  useEffect(() => {
    if (modalDate) {
      getEntryData();
    }
    //eslint-disable-next-line
  }, [modalDate]);

  useEffect(() => {
    if (entryData) {
      getBookingData();
      getHolidayData();
      getOffdayData();
      getPickupData();
    } else {
      setBookingData([]);
      setHolidayData([]);
      setOffdayData([]);
      setPickupData([]);
    }
    //eslint-disable-next-line
  }, [entryData]);

  async function getEntryData() {
    const res = await fetch(config.BACKEND_URL + `entry/${modalDate}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      setEntryData(await res.json());
    } else {
      console.log("Error: ", await res.json());
    }
  }

  async function getBookingData() {
    if (entryData) {
      let bookingList = [];
      async function fetchData(data) {
        const res = await fetch(config.BACKEND_URL + `booking/${data}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        bookingList.push(await res.json());
      }
      for (let x of entryData.bookings) {
        await fetchData(x);
      }
      setBookingData(bookingList);
    }
  }

  async function getHolidayData() {
    if (entryData) {
      let holidayList = [];
      async function fetchData(data) {
        const res = await fetch(config.BACKEND_URL + `holiday/${data}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        holidayList.push(await res.json());
      }
      for (let x of entryData.holidays) {
        await fetchData(x);
      }
      setHolidayData(holidayList);
    }
  }

  async function getOffdayData() {
    if (entryData) {
      let offdayList = [];
      async function fetchData(data) {
        const res = await fetch(config.BACKEND_URL + `offday/${data}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        offdayList.push(await res.json());
      }
      for (let x of entryData.offdays) {
        await fetchData(x);
      }
      setOffdayData(offdayList);
    }
  }

  async function getPickupData() {
    if (entryData) {
      let pickupList = [];
      async function fetchData(data) {
        const res = await fetch(config.BACKEND_URL + `pickup/${data}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        pickupList.push(await res.json());
      }
      for (let x of entryData.pickups) {
        await fetchData(x);
      }
      setPickupData(pickupList);
    }
  }

  async function refreshEntries() {
    getEntryData();
    getMonthEntries();
  }

  return (
    <>
      <div
        onClick={() => {
          setModalDate(null);
        }}
        className="modalBackground"
      />
      <div className="entryModal" style={{ minWidth: "60%" }}>
        <div className="calendarModalDate">
          {modalDate.toLocaleDateString("en-SG", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="calendarModalLabel">
          <div
            className="createButton"
            onClick={() => {
              setCreateNew("booking");
            }}
          >
            CREATE NEW
          </div>
          Bookings
        </div>
        <div className="calendarModalContent">
          {bookingData ? (
            bookingData.length === 0 ? (
              <h2>No bookings</h2>
            ) : (
              bookingData.map((data) => (
                <BookingEntry data={data} getBookingData={refreshEntries} />
              ))
            )
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
        <div className="calendarModalLabel">
          <div
            className="createButton"
            onClick={() => {
              setCreateNew("holiday");
            }}
          >
            CREATE NEW
          </div>
          Holidays
        </div>
        <div className="calendarModalContent">
          {holidayData ? (
            holidayData.length === 0 ? (
              <h2>No holidays</h2>
            ) : (
              holidayData.map((data) => (
                <HolidayEntry data={data} getHolidayData={refreshEntries} />
              ))
            )
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
        <div className="calendarModalLabel">
          <div
            className="createButton"
            onClick={() => {
              setCreateNew("offday");
            }}
          >
            CREATE NEW
          </div>
          Offdays
        </div>
        <div className="calendarModalContent">
          {offdayData ? (
            offdayData.length === 0 ? (
              <h2>No offdays</h2>
            ) : (
              offdayData.map((data) => (
                <OffdayEntry data={data} getOffdayData={refreshEntries} />
              ))
            )
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
        <div className="calendarModalLabel">
          <div
            className="createButton"
            onClick={() => {
              setCreateNew("pickup");
            }}
          >
            CREATE NEW
          </div>
          Pickups
        </div>
        <div className="calendarModalContent">
          {pickupData ? (
            pickupData.length === 0 ? (
              <h2>No pickups</h2>
            ) : (
              pickupData.map((data) => (
                <PickupEntry data={data} getPickupData={refreshEntries} />
              ))
            )
          ) : (
            <h2>Loading...</h2>
          )}
        </div>
      </div>
      {createNew === "booking" ? (
        <NewBooking
          setNewBooking={setCreateNew}
          getBookingData={refreshEntries}
          defaultDate={modalDate}
        />
      ) : (
        ""
      )}
      {createNew === "holiday" ? (
        <NewHoliday
          setNewHoliday={setCreateNew}
          getHolidayData={refreshEntries}
          defaultDate={modalDate}
        />
      ) : (
        ""
      )}
      {createNew === "offday" ? (
        <NewOffday
          setNewOffday={setCreateNew}
          getOffdayData={refreshEntries}
          defaultDate={modalDate}
        />
      ) : (
        ""
      )}
      {createNew === "pickup" ? (
        <NewPickup
          setNewPickup={setCreateNew}
          getPickupData={refreshEntries}
          defaultDate={modalDate}
        />
      ) : (
        ""
      )}
    </>
  );
}
