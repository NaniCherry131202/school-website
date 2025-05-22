import express from 'express';
import { auth } from '../middleware/auth.js';
import { Notification } from '../models/Notification.js'; // Import Notification model

const router = express.Router();

// Get all notifications (public)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ date: -1 }).limit(5);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Add a notification (teacher/admin only)
router.post('/', auth, async (req, res) => {
  const { name, description, link } = req.body;
  if (!name || !description) {
    return res.status(400).json({ message: 'Name and description are required' });
  }
  try {
    const newNotification = new Notification({ name, description, link });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (err) {
    console.error('Error creating notification:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

// Delete a notification (admin/teacher only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedNotification = await Notification.findByIdAndDelete(req.params.id);
    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    console.error('Error deleting notification:', err.message, err.stack);
    res.status(500).json({ message: 'Server error', details: err.message });
  }
});

export default router;