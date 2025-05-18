import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});


export default mongoose.model('Notification', notificationSchema);