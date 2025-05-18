import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';


const router = express.Router();

// Get scores for logged-in student
router.get('/scores', verifyToken(['student']), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('scores');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student.scores);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

// Get attendance for logged-in student
router.get('/attendance', verifyToken(['student']), async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('attendance');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (!student.attendance || student.attendance.length === 0) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.json(student.attendance);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

export default router;