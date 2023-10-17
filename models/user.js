const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: [true, "no id specified"] },
  friendList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  password: { type: String, required: [true, "Please Enter The Password"] },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
