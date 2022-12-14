// Finds an existing entry and deletes a booking/event element from their respective array
// If both the booking and entry arrays are empty, delete the whole entry

const Entry = require("../models/entry");

//Params: [date to be checked against], [_id of booking/event/holiday etc], ["bookings"/"events"/"holidays"/etc...]
async function entryFindDelete(dateTimeStr, _id, type) {
  let dateTime = new Date(dateTimeStr);
  let year = dateTime.getFullYear();
  let month = (dateTime.getMonth() + 1).toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
  let day = dateTime
    .getDate()
    .toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
  let dateTimeFormat = year + "-" + month + "-" + day;

  const result = await Entry.findOne({ date: new Date(dateTimeFormat) });
  if (result === null) {
    //return error. should not happen in any circumstance
    console.log("Cannot find entry?!");
  } else {
    const result2 = await Entry.findOneAndUpdate(
      { date: new Date(dateTimeFormat) },
      { $pull: { [type]: _id } },
      { new: true }
    );
    if (result2.bookings.length === 0 && result2.events.length === 0) {
      await Entry.findOneAndDelete({ date: new Date(dateTimeFormat) });
    }
  }
}

module.exports = entryFindDelete;
