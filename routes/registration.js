const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");

// POST: ลงทะเบียน
router.post("/", async (req, res) => {
  const { name, email, phone, lineUserId } = req.body;

  try {
    const newRegistration = new Registration({
      name,
      email,
      phone,
      lineUserId,
    });
    await newRegistration.save();
    res.status(201).json({ message: "ลงทะเบียนสำเร็จ!" });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว!" });
    } else {
      console.error(err.message);
      res.status(500).json({ message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
  }
});

module.exports = router;
