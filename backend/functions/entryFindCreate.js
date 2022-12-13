// Looks for an existing entry, and if it doesn't exist, create one
// Returns entry

const Entry = require("../models/entry");

async function entryFindCreate(dateTimeStr) {
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
  console.log(dateTimeFormat);

  const result = await Entry.findOne({ date: new Date(dateTimeFormat) });
  if (result === null) {
    const newEntry = await Entry.create({ date: new Date(dateTimeFormat) });
    return newEntry;
  } else {
    return result;
  }
}

module.exports = entryFindCreate;
