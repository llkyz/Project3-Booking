const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authController = require("./controllers/authentication");
const userController = require("./controllers/user");
const fetchController = require("./controllers/fetch");
const calendarController = require("./controllers/calendar");
require("dotenv").config();

let mongoURI = process.env.DATABASE;

mongoose.set("strictQuery", true);
mongoose.set("runValidators", true);
mongoose.set("debug", true);
mongoose.connect(mongoURI);
db.on("open", () => console.log("MongoDB connection established"));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:3000");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use("/checktoken", authController);
app.use("/user", userController);
app.use("/fetch", fetchController);
app.use("/calendar", calendarController);
app.listen(process.env.PORT, console.log("Listening to port 5000..."));

app.get("/", (req, res) => {
  res.redirect("/calendar");
});

app.get("/logout", (req, res) => {
  res.send(200).clearCookie("token");
});

app.get("*", (req, res) => {
  res.status(404).send("<h1>Error 404: Page Not Found</h1>");
});
