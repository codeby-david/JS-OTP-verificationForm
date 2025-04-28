const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// In-memory storage (replace with database in production)
const otpStorage = {};

// Generate and send OTP
app.post('/api/send-otp', (req, res) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
  const expires = Date.now() + 300000; // 5 minutes expiry
  
  otpStorage[phone] = { otp, expires };
  
  console.log(`OTP for ${phone}: ${otp}`); // In real app, send via SMS service
  res.json({ success: true, message: "OTP sent successfully" });
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ error: "Phone and OTP are required" });
  }

  const record = otpStorage[phone];
  
  if (!record) {
    return res.status(400).json({ error: "OTP not requested or expired" });
  }
  
  if (record.expires < Date.now()) {
    delete otpStorage[phone];
    return res.status(400).json({ error: "OTP expired" });
  }
  
  if (record.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP" });
  }
  
  delete otpStorage[phone];
  res.json({ success: true, message: "OTP verified successfully" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));