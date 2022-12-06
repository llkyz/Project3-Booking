const sophieData = require("./sophie");
const shopifyData = require("./shopify");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = mongoose.connection;
const Test = require("./models/test");

mongoURI = "mongodb+srv://JaxToh:jaxatlas@cluster0.mqjwngr.mongodb.net/test";

mongoose.connect(mongoURI);
db.on("open", () => console.log("MongoDB connection established"));

app.listen(3000, console.log("Listening to port 3000..."));

async function getSophieData() {
  let result = await sophieData();
  console.log(result);
}
getSophieData();

async function getShopifyData() {
  let result = await shopifyData();
  console.log(result);
}

getShopifyData();

const testData = [
  { title: "Title1", entry: "Some data here" },
  { title: "Title222222", entry: "More data" },
];

async function seedData() {
  const result = await Test.insertMany(testData);
  console.log(result);
}

// seedData()

async function findData() {
  const result = await Test.find();
  console.log(result);
}

// findData()

app.get("/", (req, res) => {
  res.render("index.ejs");
});
