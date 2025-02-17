const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: String,
  password: String,
  role: { 
    type: String, 
    enum: ["student", "instructor"], // Defines allowed roles
    required: true
  }
});

module.exports = mongoose.model("User", UserSchema);
