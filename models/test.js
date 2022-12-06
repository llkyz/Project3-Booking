const mongoose = require("mongoose")

const testSchema = mongoose.Schema({
    title: {type: String},
    entry: {type: String}
})

const Test = mongoose.model("Test", testSchema)

module.exports = Test