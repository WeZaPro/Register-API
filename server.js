const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const lineLoginRouter = require("./routes/lineLogin"); // Router สำหรับ LINE login
const bodyParser = require("body-parser");

const app = express();

// ใช้ cors
app.use(cors());

// ใช้ body-parser สำหรับการรับข้อมูลจาก POST
app.use(bodyParser.json());

// เชื่อมต่อ MongoDB
mongoose
  .connect("mongodb://localhost:27017/BookingApp", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ใช้ route สำหรับ LINE Login
app.use(lineLoginRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
