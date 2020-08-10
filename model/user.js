const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],

    photo: {
      type: String,
      default:"https://res.cloudinary.com/cha/image/upload/v1597062272/profile-default-300x242_irhlou.jpg",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
