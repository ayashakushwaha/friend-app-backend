const mongoose = require("mongoose");
const express = require("express");
const multer = require("multer");
const User = require("./models/user");

const app = express();
const port = 5000;

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Define where to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage });

// Handle form submissions
app.post("/submit", upload.single("photo"), async (req, res) => {
  let { id, friendId, password } = req.body;
  const uploadedPhoto = req.file;

  // Process and save the data here

  console.log(
    `Received Data:\ninputId: ${id}, inputFriendId: ${friendId}, inputPassword: ${password}`
  );
  console.log("Uploaded Photo:", uploadedPhoto);
  // await mongoose.connect("mongodb://user:password@127.0.0.1:27017/myPwdDb");
  const checkUserId = await User.findOne({ userId: id });
  const checkFriendId = await User.findOne({ userId: friendId });
  const friendList = [];
  if (!checkFriendId) {
    console.log(
      "Friend with id " + friendId + " does not exist. Hence Friend not added."
    );
    friendId = "";
  } else {
    friendList.push(checkFriendId._id);
  }

  console.log("Friend,s(User B) friendlist is updated.");
  let user = checkUserId;
  if (!checkUserId) {
    user = new User({
      userId: id,
      friendList,
      password,
    });
    await User.insertMany([user]);
    console.log("User added", user);
  } else {
    console.log("user with id " + id + " already exists.");
  }

  if (checkFriendId) {
    let friendFriendList = checkFriendId.friendList;
    friendFriendList.push(user._id);
    await User.updateOne(
      { userId: friendId },
      {
        friendList: friendFriendList,
      }
    );

    const updatedFriend = await User.findOne({ userId: friendId });

    console.log("friend's FriendList updated ", updatedFriend);
  } else {
    console.log("friend's FriendList updated ", checkFriendId);
  }

  console.log("------------------End-------------------");
  res.status(200).send("Data received.");
});

mongoose.connect("mongodb://127.0.0.1:27017/myPwdDb");

const db = mongoose.connection;
db.on("error", () => console.log("DB connection failed"));
db.on("open", () => console.log("DB connection successful"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
