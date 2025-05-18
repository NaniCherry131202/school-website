import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';

const router = express.Router(); // Initialize the router

// In-memory store for OTPs
const otpStore = new Map();

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.error("Email is required to send OTP");
    return res.status(400).json({ message: 'Email is required' });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("Generated OTP:", otp); // Log the generated OTP

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP for Registration',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP Sent to Email:", email); // Log email where OTP is sent

    // Store OTP in the in-memory store with a 10-minute expiration
    otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 });
    console.log("OTP Stored in Memory:", otpStore.get(email)); // Log OTP stored in memory

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error("Error Sending OTP:", err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    console.error("Email and OTP are required for verification");
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  console.log("Verifying OTP for Email:", email); // Log the email being verified
  console.log("Received OTP:", otp); // Log the OTP received from the frontend

  // Check if the OTP exists for the given email
  const storedOtpData = otpStore.get(email);
  console.log("Stored OTP Data:", storedOtpData); // Log the stored OTP data
  if (!storedOtpData) {
    console.error("OTP Not Found or Expired for Email:", email); // Log if OTP is not found
    return res.status(400).json({ success: false, message: 'OTP expired or not found' });
  }

  // Check if the OTP matches
  if (storedOtpData.otp.toString() !== otp.toString()) {
    console.error("Invalid OTP for Email:", email); // Log if OTP does not match
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // Check if the OTP has expired
  if (Date.now() > storedOtpData.expiresAt) {
    console.error("OTP Expired for Email:", email); // Log if OTP has expired
    otpStore.delete(email); // Remove expired OTP
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  // OTP is valid
  otpStore.delete(email); // Remove OTP after successful verification
  console.log("OTP Verified Successfully for Email:", email); // Log successful OTP verification
  res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

// Setup storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Register user
router.post('/register', upload.single('profilePic'), async (req, res) => {
  const { name, email, password, role, rollNo, classLevel, teacherId } = req.body;
  const profilePic = req.file?.filename; // Optional chaining in case no file is uploaded

  console.log("Register Request Data:", { name, email, password, role, rollNo, classLevel, teacherId, profilePic }); // Log incoming data

  // Validate required fields
  if (!name || !email || !password || !role) {
    console.error("Missing required fields");
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("User already exists:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object based on role
    const userData = { name, email, password: hashedPassword, role, profilePic };

    if (role === 'student') {
      if (!rollNo || !classLevel) {
        console.error("Missing student-specific fields");
        return res.status(400).json({ message: 'Missing student-specific fields' });
      }
      userData.rollNo = rollNo;
      userData.classLevel = classLevel;
    } else if (role === 'teacher') {
      if (!teacherId) {
        console.error("Missing teacher-specific fields");
        return res.status(400).json({ message: 'Missing teacher-specific fields' });
      }
      userData.teacherId = teacherId;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.error("Email and password are required for login");
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found:", email);
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Invalid credentials for Email:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      token,
      role: user.role,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;