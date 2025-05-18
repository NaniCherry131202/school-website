import express from 'express';
import multer from 'multer';
import Admission from '../models/Admission.js';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage });

// @route   POST /api/admissions
// @desc    Submit a new admission application
// @access  Public
router.post('/', upload.fields([{ name: 'photo' }, { name: 'aadhar' }]), async (req, res) => {
  try {
    const { name, email, phone, dob, address, class: studentClass } = req.body;

    if (!name || !email || !phone || !dob || !address || !studentClass || !req.files.photo || !req.files.aadhar) {
      return res.status(400).json({ message: 'All fields are required, including class, photo, and Aadhaar card.' });
    }

    const newAdmission = new Admission({
      name,
      email,
      phone,
      dob,
      address,
      class: studentClass,
      photo: req.files.photo[0].path,
      aadhar: req.files.aadhar[0].path,
    });

    await newAdmission.save();
    res.status(201).json({ message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error saving admission:', error);
    res.status(500).json({ message: 'An error occurred while processing your application.' });
  }
});

// @route   GET /api/admissions
// @desc    Get all admission applications
// @access  Public
router.get('/', async (req, res) => {
  try {
    const admissions = await Admission.find();
    res.status(200).json(admissions);
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({ message: 'An error occurred while fetching admissions.' });
  }
});

export default router;