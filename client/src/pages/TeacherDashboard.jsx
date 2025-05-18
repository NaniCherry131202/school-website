import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');

  // Fetch student list on mount
  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/teacher/students', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data); // assumes [{ _id, name }]
      } catch (err) {
        console.error('Failed to load students:', err);
      }
    };
    fetchStudents();
  }, []);

  const handleMarksheet = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/teacher/marksheet',
      { studentId, subject, marks },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Marksheet updated');
  };

  const handleAttendance = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post(
      'http://localhost:5000/api/teacher/attendance',
      { studentId, date, status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Attendance updated');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/logo.png" alt="Ashoka Vidya Mandir Logo" className="w-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-center mb-6">Teacher Dashboard</h2>

        {/* Marksheet Form */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Update Marksheet</h3>
          <form onSubmit={handleMarksheet}>
            <div className="mb-4">
              <label className="block text-gray-700">Select Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student._id})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Marks</label>
              <input
                type="number"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Update Marksheet
            </motion.button>
          </form>
        </div>

        {/* Attendance Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Update Attendance</h3>
          <form onSubmit={handleAttendance}>
            <div className="mb-4">
              <label className="block text-gray-700">Select Student</label>
              <select
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">-- Select Student --</option>
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {student.name} ({student._id})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              >
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <motion.button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Update Attendance
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default TeacherDashboard;
