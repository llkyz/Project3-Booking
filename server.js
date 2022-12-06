const sophieData = require('./sophie')
const shopifyData = require('./shopify')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const db = mongoose.connection
const Test = require("./models/test")

mongoURI = "mongodb+srv://JaxToh:jaxatlas@cluster0.mqjwngr.mongodb.net/test"

mongoose.connect(mongoURI)
db.on("open", ()=>console.log("MongoDB connection established"))

app.listen(3000, console.log("Listening to port 3000..."))

// sophieData()
shopifyData()

const testData = [{title: "Title1", entry: "Some data here"}, {title: "Title222222", entry: "More data"}]

async function seedData() {
    const result = await Test.insertMany(testData)
    console.log(result)
}

// seedData()

async function findData() {
    const result = await Test.find()
    console.log(result)
}

// findData()

app.get("/", (req, res) => {
    res.render("index.ejs")
})

/*
sophieData.id
sophieData.total_payout_amount
sophieData.total_quantity
sophieData.start_date
sophieData.start_time
sophieData.end_time
sophieData.order.customer_name
sophieData.order.contact_num
*/


/*
shopifyData.id
shopifyData.current_total_price
shopifyData.customer.orders_count
shopifyData.line_items[0].properties[1].value
shopifyData.customer.first_name + shopifyData.customer.last_name
shopifyData.customer.phone
*/
