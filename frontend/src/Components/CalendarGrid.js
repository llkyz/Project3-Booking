import { useState, useEffect } from "react";

////consts////
const MONTHS = [
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

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const startingDate = new Date();

////functions & utilities////
const range = (end) => {
  const { result } = Array.from({ length: end }).reduce(
    ({ result, current }) => ({
      result: [...result, current],
      current: current + 1,
    }),
    { result: [], current: 1 }
  );
  return result;
};

const getDaysOfMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate();
};

const getSortedDays = (month, year) => {
  const dayIndex = new Date(year, month, 1).getDay();
  return [...DAYS.slice(dayIndex), ...DAYS.slice(0, dayIndex)];
};

const getDateObj = (day, month, year) => {
  return new Date(year, month, day);
};

const areDatesTheSame = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

////calendar////
function CalendarGrid() {
  const [currentMonth, setCurrentMonth] = useState(startingDate.getMonth());
  const [currentYear, setCurrentYear] = useState(startingDate.getFullYear());
  const [eventsArr, setEventsArr] = useState([
    {
      customer: "John",
      date: new Date(2022, 11, 12, 13),
    },

    {
      customer: "Peter",
      date: new Date(2022, 11, 20, 15)
    },

    {
      customer: "Mary",
      date: new Date(2022, 11, 23, 13)
    },
  ]);

  const DAYSINMONTH = getDaysOfMonth(currentMonth, currentYear);

  const nextMonth = () => {
    if (currentMonth < 11) {
      setCurrentMonth((prev) => prev + 1);
    } else {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth > 0) {
      setCurrentMonth((prev) => prev - 1);
    } else {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    }
  };

  return (
    <div className="wrapper">
      <div className="calendarHead">
        <p onClick={prevMonth}>prev--</p>
        <p>
          {MONTHS[currentMonth]} {currentYear}
        </p>
        <p onClick={nextMonth}>--next</p>
      </div>
      <div className="grid">
        {getSortedDays(currentMonth, currentYear).map((day, i) => (
          <span key={i} className="daysHeader">
            {day}
          </span>
        ))}
      </div>
      <div className="calendarBody">
        {range(DAYSINMONTH).map((day, i) => (
          <span
            key={i}
            className={
              areDatesTheSame(
                new Date(),
                getDateObj(day, currentMonth, currentYear)
              )
                ? "today"
                : "days"
            }
          >
            <p>{day}</p>

            {eventsArr.map(
              (event) =>
                areDatesTheSame(
                  getDateObj(day, currentMonth, currentYear),
                  event.date
                ) && (
                  <span key={event.id} className="events">
                    {event.customer}
                  </span>
                )
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CalendarGrid;
