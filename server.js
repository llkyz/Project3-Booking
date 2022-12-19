const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const adminController = require("./controllers/admin");
const authController = require("./controllers/auth");
const userController = require("./controllers/user");
const fetchController = require("./controllers/fetch");
const bookingController = require("./controllers/booking");
const holidayController = require("./controllers/holiday");
const offdayController = require("./controllers/offday");
const pickupController = require("./controllers/pickup");
const entryController = require("./controllers/entry");
require("dotenv").config();

let mongoURI = process.env.DATABASE;

mongoose.set("strictQuery", true);
mongoose.set("runValidators", true);
mongoose.set("debug", true);
mongoose.connect(mongoURI);
db.on("open", () => console.log("MongoDB connection established"));

app.use(express.static(path.join(__dirname, "./client/build")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use("/api/admin", adminController);
app.use("/api/auth", authController);
app.use("/api/user", userController);
app.use("/api/fetch", fetchController);
app.use("/api/booking", bookingController);
app.use("/api/holiday", holidayController);
app.use("/api/offday", offdayController);
app.use("/api/pickup", pickupController);
app.use("/api/entry", entryController);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

mongoose.connection.once("open", () => {
  app.listen(
    process.env.PORT,
    console.log(`Listening to port ${process.env.PORT}...`)
  );
});
