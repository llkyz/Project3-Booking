const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const cors = require("cors");
const session = require("express-session");
const userController = require("./controllers/user");
const sessionsController = require("./controllers/sessions");
const fetchController = require("./controllers/fetch");
const calendarController = require("./controllers/calendar");
require("dotenv").config();

mongoURI = process.env.DATABASE;

mongoose.set("strictQuery", true);
mongoose.connect(mongoURI);
db.on("open", () => console.log("MongoDB connection established"));

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", userController);
app.use("/sessions", sessionsController);
app.use("/fetch", fetchController);
app.use("/calendar", calendarController);
app.listen(5000, console.log("Listening to port 5000..."));

app.get("/", (req, res) => {
  res.redirect("/calendar");
});

app.get("*", (req, res) => {
  res.status(404).send("<h1>Error 404: Page Not Found</h1>");
});

// const Test = require("./models/test");

// const testData = [
//   { title: "Title1", entry: "Some data here" },
//   { title: "Title222222", entry: "More data" },
// ];

// async function seedData() {
//   const result = await Test.insertMany(testData);
//   console.log(result);
// }

// // seedData()

// async function findData() {
//   const result = await Test.find();
//   console.log(result);
// }

// // findData()

// app.get("/fetch", async (req, res) => {
//   const result = await Test.find();
//   res.json(result);
// });
