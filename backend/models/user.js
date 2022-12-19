const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minLength: 3,
  },
  password: { type: String, required: true, trim: true },
  access: { type: String, enum:['user', 'staff', 'admin'], default: "user", required: true },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
