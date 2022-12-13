import { useState } from "react";

function CalendarGrid() {
  let month = 12;
  let year = 2022;

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

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const selectedDate = new Date(year, month - 1);
  const [date, setDate] = useState(selectedDate);

  const Navigation = ({ date, setDate }) => {
    return (
      <div className="navigation">
        <div
          className="back"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setMonth(newDate.getMonth() - 1);
            setDate(newDate);
          }}
        >
          {"<-"} {MONTHS[date.getMonth() === 0 ? 11 : date.getMonth() - 1]}
        </div>

        <div className="monthAndYear">
          {MONTHS[date.getMonth()]} {date.getFullYear()}
        </div>

        <div
          className="forward"
          onClick={() => {
            const newDate = new Date(date);
            newDate.setMonth(newDate.getMonth() + 1);
            setDate(newDate);
          }}
        >
          {MONTHS[date.getMonth() === 11 ? 0 : date.getMonth() + 1]} {"->"}
        </div>
      </div>
    );
  };

  const Days = () => {
    return DAYS.map((day) => {
      return (
        <div className="day cell" key={day}>
          {day}
        </div>
      );
    });
  };

  const Grid = ({ date }) => {
    const ROWS_COUNT = 6;

    const startingDate = new Date(date.getFullYear(), date.getMonth(), 1);
    startingDate.setDate(startingDate.getDate() - (startingDate.getDay() - 1));

    const dates = [];
    for (let i = 0; i < ROWS_COUNT * 7; i++) {
      const date = new Date(startingDate);
      dates.push({ date });
      startingDate.setDate(startingDate.getDate() + 1);
    }

    return (
      <>
        {dates.map((date, i) => {
          return (
            <div key={i} className="cell">
              <div className="date">{date.date.getDate()}</div>
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="calendargrid">
      <Navigation date={date} setDate={setDate} />

      <Days />

      <Grid date={date} actualDate={date} />
    </div>
  );
}

export default CalendarGrid;
