const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  maxUsers: {
    type: Number,
    required: true,
  },
  users: [
    {
      type: String, // Change the type to String to store user names as strings
    },
  ],
});

module.exports = mongoose.model("Room", roomSchema);
