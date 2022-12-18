import React, { useState, useEffect } from "react";
import config from "../config";
import { BookingEntry, NewBooking } from "./Bookings";
import { HolidayEntry, NewHoliday } from "./Holidays";
import { OffdayEntry, NewOffday } from "./Offdays";
import { PickupEntry, NewPickup } from "./Pickups";

export default function CalendarGrid2Modal({
  modalDate,
  setModalDate,
  getMonthEntries,
}) {
  const [entryData, setEntryData] = useState();
  const [bookingData, setBookingData] = useState([]);
  const [holidayData, setHolidayData] = useState([]);
  const [offdayData, setOffdayData] = useState([]);
  const [pickupData, setPickupData] = useState([]);

  console.log(entryData);

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
        <h2>
          {modalDate.toLocaleDateString("en-SG", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </h2>
        <div className="calendarModalLabel">Bookings</div>
        <div className="calendarModalContent">
          {bookingData
            ? bookingData.length === 0
              ? "No bookings"
              : bookingData.map((data) => (
                  <BookingEntry data={data} getBookingData={refreshEntries} />
                ))
            : "Loading..."}
        </div>
        <div className="calendarModalLabel">Holidays</div>
        <div className="calendarModalContent">
          {holidayData
            ? holidayData.length === 0
              ? "No holidays"
              : holidayData.map((data) => (
                  <HolidayEntry data={data} getHolidayData={refreshEntries} />
                ))
            : "Loading..."}
        </div>
        <div className="calendarModalLabel">Offdays</div>
        <div className="calendarModalContent">
          {offdayData
            ? offdayData.length === 0
              ? "No offdays"
              : offdayData.map((data) => (
                  <OffdayEntry data={data} getOffdayData={refreshEntries} />
                ))
            : "Loading..."}
        </div>
        <div className="calendarModalLabel">Pickups</div>
        <div className="calendarModalContent">
          {pickupData
            ? pickupData.length === 0
              ? "No pickups"
              : pickupData.map((data) => (
                  <PickupEntry data={data} getPickupData={refreshEntries} />
                ))
            : "Loading..."}
        </div>
      </div>
    </>
  );
}
