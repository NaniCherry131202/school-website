import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'teacher', 'visit', 'admin'], // Added 'visit' role
    default: 'visit' 
  },
  profilePic: { type: String, default: '' },

  // Fields specific to students
  rollNo: { type: String, required: function() { return this.role === 'student'; } }, // Required for students
  classLevel: { type: String, required: function() { return this.role === 'student'; } }, // Required for students

  // Fields specific to teachers
  teacherId: { type: String, required: function() { return this.role === 'teacher'; } }, // Required for teachers

  scores: [{ 
    subject: { type: String, required: true }, 
    marks: { type: Number, required: true } 
  }],
  attendance: [{ 
    date: { type: Date, default: Date.now }, 
    status: { type: String, enum: ['present', 'absent'], required: true } 
  }],
}, { timestamps: true }); // Adds createdAt/updatedAt fields

export default mongoose.model('User', userSchema);