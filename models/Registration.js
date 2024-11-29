const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  lineUserId: {
    type: String,
    required: true,
    unique: true,
  },
});

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
