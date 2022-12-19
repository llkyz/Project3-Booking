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
function CalendarGrid2() {
  const [currentMonth, setCurrentMonth] = useState(startingDate.getMonth());
  const [currentYear, setCurrentYear] = useState(startingDate.getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  // const [modalData, setModalData] = useState({});
  const [eventsArr, setEventsArr] = useState([
    {
      id: "1",
      customer: "John",
      date: new Date(2022, 11, 12, 13),
    },

    {
      id: "2",
      customer: "Peter",
      date: new Date(2022, 11, 20, 15),
    },

    {
      id: "3",
      customer: "Sarah",
      date: new Date(2022, 11, 23, 15),
    },

    {
      id: "4",
      customer: "Mary",
      date: new Date(2022, 11, 12, 13),
    },
  ]);

  // useEffect(() => {
  //   //fetch data from backend &
  //   setEventsArr();
  // }, [])

  // data parser function?

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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openAddModal = () => {
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  return (
    <div className="wrapper">
      <div className="calendarHead">
        <button onClick={prevMonth}>prev--</button>
        <p>
          {MONTHS[currentMonth]} {currentYear}
        </p>
        <button onClick={nextMonth}>--next</button>
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
            onClick={openModal}
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
      {showModal && (
        <Modal closeModal={closeModal} openAddModal={openAddModal} />
      )}
      {showAddModal && <AddModal closeAddModal={closeAddModal} />}
    </div>
  );
}

function Modal({ closeModal, openAddModal }) {
  return (
    <div className="modal">
      <div className="modalContents">
        <h2>Events of the day</h2>
        <p>
          Match date with eventArr and map each event details // There are no
          events for the day
        </p>
      </div>
      <p>
        Some sample data from sophie/shopify{" "}
        <button disabled="true">Edit</button>
      </p>
      <p>
        Some sample data from mongodb <button>Edit</button> //opens editModal
      </p>

      <button onClick={openAddModal} className="addEvent">
        ADD NEW EVENT
      </button>
      <button onClick={closeModal} className="closeModal">
        Close
      </button>
    </div>
  );
}

function AddModal({ closeAddModal }) {
  return (
    <div className="addModal">
      <div className="AddModalContents">
        <h2>Sample Event Form</h2>
        <p>check for changes and validity, else disable save</p>
        <form>
          <fieldset>
            <legend>Customer: </legend>
            <label>
              Name: <input type="text"></input>
            </label>
            <br />
            <br />
            <label>
              Name: <input type="text"></input>
            </label>
            <br />
            <br />
            <label>
              Name: <input type="text"></input>
            </label>
          </fieldset>
          <br />
          <fieldset>
            <legend>Booking details: </legend>
            <label>
              Date: <input type="text"></input>
            </label>
            <br />
            <br />
            <label>
              Time: <input type="text"></input>
            </label>
            <br />
            <br />
            <label>
              Origin: <input type="text"></input>
            </label>
          </fieldset>
        </form>
      </div>
      <button onClick={closeAddModal} className="addEvent">
        SAVE & UPDATE
      </button>
      <button onClick={closeAddModal} className="closeModal">
        Cancel
      </button>
    </div>
  );
}

export default CalendarGrid2;
