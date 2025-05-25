import express from 'express';
import User from '../models/User.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all students (for dropdowns etc.)
router.get('/students', verifyToken(['teacher', 'admin']), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('_id name rollNo classLevel');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update attendance
router.post('/attendance', verifyToken(['teacher']), async (req, res) => {
  const { studentId, date, status } = req.body;
  try {
    const teacher = await User.findById(req.user.id);
    if (teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.attendance.push({ date, status: status.toLowerCase() });
    await student.save();
    res.json({ message: 'Attendance updated' });
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update marksheet
router.post('/marksheet', verifyToken(['teacher']), async (req, res) => {
  const { studentId, subject, marks } = req.body;
  try {
    const teacher = await User.findById(req.user.id);
    if (teacher.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const student = await User.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.scores.push({ subject, marks });
    await student.save();
    res.json({ message: 'Marksheet updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;