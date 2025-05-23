// models/Admission.js
import mongoose from 'mongoose';

const PreviousSchoolSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  location: { type: String, trim: true },
  class: { type: String, trim: true },
  yearOfStudy: { type: String, trim: true },
  percentageOrGrade: { type: String, trim: true },
});

const AdmissionSchema = new mongoose.Schema({
  formNo: {
    type: String,
    trim: true,
    default: () => `FORM-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Auto-generate Form Number
  },
  admissionNo: { type: String, trim: true, default: null }, // Set to null, to be assigned later
  student: {
    name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    aadharNo: { type: String, required: true, trim: true },
    placeOfBirth: { type: String, trim: true },
    state: { type: String, trim: true },
    nationality: { type: String, trim: true },
    religion: { type: String, trim: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    caste: { type: String, enum: ['BC', 'SC', 'ST', 'OC'], trim: true },
    motherTongue: { type: String, trim: true },
    bloodGroup: { type: String, trim: true },
    identificationMarks: [{ type: String, trim: true }],
  },
  address: {
    residentialAddress: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pin: { type: String, trim: true },
  },
  father: {
    name: { type: String, required: true, trim: true },
    aadharNo: { type: String, trim: true },
    dob: { type: Date },
    occupation: { type: String, trim: true },
    mobile: { type: String, required: true, trim: true },
  },
  mother: {
    name: { type: String, required: true, trim: true },
    aadharNo: { type: String, trim: true },
    dob: { type: Date },
    occupation: { type: String, trim: true },
    mobile: { type: String, required: true, trim: true },
  },
  admissionDetails: {
    class: { type: String, required: true, trim: true },
    academicYear: { type: String, required: true, trim: true },
  },
  previousAcademicRecord: [PreviousSchoolSchema],
  appraisal: {
    achievements: { type: String, trim: true },
    behavior: { type: String, enum: ['Mild', 'Normal', 'Hyperactive'], trim: true },
    healthHistory: { type: String, trim: true },
  },
  parentGuardian: {
    name: { type: String, required: true, trim: true },
    signature: { type: String },
  },
  photo: { type: String, required: true },
  aadhar: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Admission = mongoose.model('Admission', AdmissionSchema);

export default Admission;