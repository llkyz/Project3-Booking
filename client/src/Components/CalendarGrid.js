import React, { useState, useEffect } from "react";
import config from "../config";
import CalendarGridModal from "./CalendarGridModal";

export default function CalendarGrid2({
  accessLevel,
  calendarRefresh,
  setCalendarRefresh,
}) {
  const [calendarMonth, setCalendarMonth] = useState();
  const [calendarYear, setCalendarYear] = useState();
  const [monthEntries, setmonthEntries] = useState([]);
  const [modalDate, setModalDate] = useState(null);

  useEffect(() => {
    function setDates() {
      let currentDate = new Date();
      setCalendarMonth(currentDate.getMonth());
      setCalendarYear(currentDate.getFullYear());
    }
    setDates();
  }, []);

  useEffect(() => {
    if (calendarRefresh) {
      getMonthEntries();
      setCalendarRefresh(false);
    }
    //eslint-disable-next-line
  }, [calendarRefresh]);

  useEffect(() => {
    if (calendarMonth !== undefined && calendarYear !== undefined) {
      getMonthEntries();
    }
    //eslint-disable-next-line
  }, [calendarMonth, calendarYear]);

  async function getMonthEntries() {
    const res = await fetch(
      config.BACKEND_URL + `entry/range/${calendarYear}&${calendarMonth}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200) {
      setmonthEntries(await res.json());
    } else {
      console.log("Error: ", await res.json());
    }
  }

  return (
    <>
      <div className="calendarGrid">
        <Header
          calendarMonth={calendarMonth}
          calendarYear={calendarYear}
          setCalendarMonth={setCalendarMonth}
          setCalendarYear={setCalendarYear}
        />
        <DayHeader />
        <Days
          calendarYear={calendarYear}
          calendarMonth={calendarMonth}
          monthEntries={monthEntries}
          setModalDate={setModalDate}
          accessLevel={accessLevel}
        />
        {modalDate && (accessLevel === "staff" || accessLevel === "admin") ? (
          <CalendarGridModal
            modalDate={modalDate}
            setModalDate={setModalDate}
            getMonthEntries={getMonthEntries}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function Header({
  calendarMonth,
  calendarYear,
  setCalendarMonth,
  setCalendarYear,
}) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function decreaseMonth() {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  }

  function increaseMonth() {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  }

  return (
    <>
      <div className="previousMonth" onClick={decreaseMonth}>
        <div className="previousMonthArrow" />
        {calendarMonth === 0 ? months[11] : months[calendarMonth - 1]}
      </div>
      <div className="calendarMonth">
        {`${months[calendarMonth]} ${calendarYear}`}
      </div>
      <div className="nextMonth" onClick={increaseMonth}>
        {calendarMonth === 11 ? months[0] : months[calendarMonth + 1]}
        <div className="nextMonthArrow" />
      </div>
    </>
  );
}

function DayHeader() {
  return (
    <>
      <div className="day">Sun</div>
      <div className="day">Mon</div>
      <div className="day">Tue</div>
      <div className="day">Wed</div>
      <div className="day">Thu</div>
      <div className="day">Fri</div>
      <div className="day">Sat</div>
    </>
  );
}

function Days({
  calendarYear,
  calendarMonth,
  monthEntries,
  setModalDate,
  accessLevel,
}) {
  const [cellList, setCellList] = useState();
  let numDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  let firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  let emptyCells = [];

  useEffect(() => {
    let cells = [];
    if (monthEntries) {
      let entryList = monthEntries.map((data) => data);
      for (let x = 1; x <= numDays; x++) {
        let entryFound = false;
        for (let y = 0; y < entryList.length; y++) {
          if (
            new Date(entryList[y].date).setHours(0, 0, 0, 0) ===
            new Date(calendarYear, calendarMonth, x).setHours(0, 0, 0, 0)
          ) {
            cells.push(
              <div
                className="cell"
                id={
                  new Date().setHours(0, 0, 0, 0) ===
                  new Date(calendarYear, calendarMonth, x).setHours(0, 0, 0, 0)
                    ? "today"
                    : ""
                }
                key={x}
                onClick={() => {
                  setModalDate(new Date(calendarYear, calendarMonth, x));
                }}
                style={{
                  cursor:
                    accessLevel === "staff" || accessLevel === "admin"
                      ? "pointer"
                      : "default",
                }}
              >
                <p>{x}</p>
                {entryList[y].bookings.length === 0 ? (
                  ""
                ) : (
                  <div className="bookingNode">
                    Bookings: {entryList[y].bookings.length}
                  </div>
                )}
                {entryList[y].holidays.length === 0 ? (
                  ""
                ) : (
                  <div className="holidayNode">
                    Holidays: {entryList[y].holidays.length}
                  </div>
                )}
                {entryList[y].offdays.length === 0 ? (
                  ""
                ) : (
                  <div className="offdayNode">
                    Offdays: {entryList[y].offdays.length}
                  </div>
                )}
                {entryList[y].pickups.length === 0 ? (
                  ""
                ) : (
                  <div className="pickupNode">
                    Pickups: {entryList[y].pickups.length}
                  </div>
                )}
              </div>
            );
            entryList.splice(y, 1);
            entryFound = true;
            break;
          }
        }
        if (entryFound === false) {
          cells.push(
            <div
              className="cell"
              id={
                new Date().setHours(0, 0, 0, 0) ===
                new Date(calendarYear, calendarMonth, x).setHours(0, 0, 0, 0)
                  ? "today"
                  : ""
              }
              key={x}
              onClick={() => {
                setModalDate(new Date(calendarYear, calendarMonth, x));
              }}
              style={{
                cursor:
                  accessLevel === "staff" || accessLevel === "admin"
                    ? "pointer"
                    : "default",
              }}
            >
              <p>{x}</p>
            </div>
          );
        }
      }
    }
    setCellList(cells);
  }, [
    monthEntries,
    calendarMonth,
    calendarYear,
    numDays,
    setModalDate,
    accessLevel,
  ]);

  for (let x = 0; x < firstDay; x++) {
    emptyCells.push(<div className="emptyCell" key={x} />);
  }

  return (
    <>
      {emptyCells}
      {cellList}
    </>
  );
}
