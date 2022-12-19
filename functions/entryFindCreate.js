// Looks for an existing entry, and if it doesn't exist, create one
// Returns entry

const Entry = require("../models/entry");

//Params: [date to be checked against], [_id of booking/event/holiday etc], ["bookings"/"events"/"holidays"/etc...]
async function entryFindCreate(dateTimeStr, _id, type) {
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

  try {
    const result = await Entry.findOne({ date: new Date(dateTimeFormat) });
    if (result === null) {
      await Entry.create({ date: new Date(dateTimeFormat), [type]: [_id] });
    } else {
      const result = await Entry.findOneAndUpdate(
        { date: new Date(dateTimeFormat) },
        { $push: { [type]: _id } },
        { new: true }
      );
      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = entryFindCreate;
