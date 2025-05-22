import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: false },
  date: { type: Date, default: Date.now },
});
export const Notification = mongoose.model('Notification', notificationSchema);