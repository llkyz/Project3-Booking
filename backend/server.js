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

let mongoURI = process.env.DATABASE;

mongoose.set("strictQuery", true);
mongoose.connect(mongoURI);
db.on("open", () => console.log("MongoDB connection established"));

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/checktoken", authController);
app.use("/user", userController);
app.use("/fetch", fetchController);
app.use("/calendar", calendarController);
app.listen(5000, console.log("Listening to port 5000..."));

app.get("/", (req, res) => {
  res.redirect("/calendar");
});

app.get("*", (req, res) => {
  res.status(404).send("<h1>Error 404: Page Not Found</h1>");
});
