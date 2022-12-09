const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const adminController = require("./controllers/admin");
const authController = require("./controllers/auth");
const userController = require("./controllers/user");
const fetchController = require("./controllers/fetch");
const calendarController = require("./controllers/calendar");
const methodOverride = require("method-override");
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
app.use(methodOverride("_method"));
app.use(
  cors({
    origin: "http://127.0.0.1:3000",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use("/admin", adminController);
app.use("/auth", authController);
app.use("/user", userController);
app.use("/fetch", fetchController);
app.use("/calendar", calendarController);
app.listen(
  process.env.PORT,
  console.log(`Listening to port ${process.env.PORT}...`)
);

app.get("/", (req, res) => {
  res.redirect("/calendar");
});

app.get("/logout", (req, res) => {
  res.status(200).clearCookie("token").send();
});
