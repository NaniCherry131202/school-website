import mongoose from 'mongoose';

const AdmissionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true, trim: true },
  class: { type: String, required: true }, // New field for class
  photo: { type: String, required: true },
  aadhar: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Admission = mongoose.model('Admission', AdmissionSchema);

export default Admission;