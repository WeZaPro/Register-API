const express = require("express");
const axios = require("axios");
const Registration = require("../models/Registration");

const router = express.Router();

// LINE Login Route
router.post("/api/line-login", (req, res) => {
  console.log("line login");
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:5000/api/line-callback&state=YOUR_RANDOM_STATE&scope=profile%20openid`;

  // ส่ง URL กลับไปยัง frontend (Vue.js)
  res.json({ redirectUrl: lineLoginUrl });
});

// LINE Callback Route
router.get("/api/line-callback", async (req, res) => {
  const code = req.query.code; // รับค่า code จาก URL query

  try {
    // แลกเปลี่ยน code เป็น access token จาก LINE
    const tokenResponse = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      null,
      {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "http://localhost:5000/api/line-callback", // ต้องตรงกับใน LINE Console
          client_id: "2006618905",
          client_secret: "3328e0be9b61b5580ba7ffcdb2ccc3f5",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // ใช้ access token เพื่อดึงข้อมูลผู้ใช้จาก LINE
    const profileResponse = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const lineUserId = profileResponse.data.userId;

    // สามารถบันทึกข้อมูลผู้ใช้ใน MongoDB ได้ที่นี่
    const newRegistration = new Registration({
      name: profileResponse.data.displayName,
      email: "", // คุณอาจจะใช้ข้อมูลจาก LINE หรือให้ผู้ใช้กรอกในภายหลัง
      phone: "", // เช่นเดียวกับอีเมล
      lineUserId: lineUserId,
    });

    await newRegistration.save();

    res.json({ message: "เข้าสู่ระบบสำเร็จ", userId: lineUserId });
  } catch (error) {
    console.error("Error during LINE OAuth:", error);
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดระหว่างการเชื่อมต่อกับ LINE" });
  }
});

module.exports = router;
