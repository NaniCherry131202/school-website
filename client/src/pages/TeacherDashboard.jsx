import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [marks, setMarks] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fallback for local development

  // Fetch student list on mount
  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        window.location.href = '/login';
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/teacher/students`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        console.error('Failed to load students:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to load students');
        if (err.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const handleMarksheet = async (e) => {
    e.preventDefault();
    if (!studentId || !subject || !marks) {
      toast.error('Please fill out all fields.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/teacher/marksheet`,
        { studentId, subject, marks },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Marksheet updated successfully', { position: 'top-right', autoClose: 3000 });
      // Reset form
      setStudentId('');
      setSubject('');
      setMarks('');
    } catch (err) {
      console.error('Error updating marksheet:', err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Failed to update marksheet', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttendance = async (e) => {
    e.preventDefault();
    if (!studentId || !date || !status) {
      toast.error('Please fill out all fields.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/api/teacher/attendance`,
        { studentId, date, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Attendance updated successfully', { position: 'top-right', autoClose: 3000 });
      // Reset form
      setStudentId('');
      setDate('');
      setStatus('');
    } catch (err) {
      console.error('Error updating attendance:', err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || 'Failed to update attendance', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/logo.png" alt="Ashoka Vidya Mandir Logo" className="w-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-center mb-6">Teacher Dashboard</h2>

        {loadingStudents ? (
          <p className="text-center text-gray-600">Loading students...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            {/* Marksheet Form */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Update Marksheet</h3>
              <form onSubmit={handleMarksheet}>
                <div className="mb-4">
                  <label className="block text-gray-700">Select Student</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">-- Select Student --</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} (Roll No: {student.rollNo})
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
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Marks</label>
                  <input
                    type="number"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                    min="0"
                    max="100"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Marksheet'}
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
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">-- Select Student --</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name} (Roll No: {student.rollNo})
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
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                    max={new Date().toISOString().split('T')[0]} // Prevent future dates
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>
                <motion.button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Attendance'}
                </motion.button>
              </form>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default TeacherDashboard;