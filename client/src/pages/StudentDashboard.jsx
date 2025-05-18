import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

function StudentDashboard() {
  const [scores, setScores] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'; // Fallback for local development

  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        window.location.href = '/login';
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        // Fetch scores and attendance concurrently
        const [scoresResponse, attendanceResponse] = await Promise.all([
          axios.get(`${API_URL}/api/student/scores`, { headers }),
          axios.get(`${API_URL}/api/student/attendance`, { headers }),
        ]);

        setScores(scoresResponse.data);
        setAttendance(attendanceResponse.data);
      } catch (err) {
        console.error('Error fetching student data:', err.response?.data?.message || err.message);
        setError(err.response?.data?.message || 'Failed to fetch student data');
        if (err.response?.status === 401) {
          window.location.href = '/login'; // Redirect to login if unauthorized
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudentData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.div
        className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/logo.png" alt="Ashoka Vidya Mandir Logo" className="w-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-center mb-6">Student Dashboard</h2>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            {/* Scores Section */}
            <h3 className="text-xl font-semibold mb-4">Your Scores</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {scores.length > 0 ? (
                scores.map((score, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-blue-100 rounded-lg shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-lg font-semibold">{score.subject}</p>
                    <p>Marks: {score.marks}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500">No scores available</p>
              )}
            </div>

            {/* Attendance Section */}
            <h3 className="text-xl font-semibold mb-4">Your Attendance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attendance.length > 0 ? (
                attendance.map((day, index) => (
                  <motion.div
                    key={index}
                    className="p-4 bg-green-100 rounded-lg shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-lg font-semibold">{new Date(day.date).toLocaleDateString()}</p>
                    <p>Status: {day.status}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-gray-500">No attendance records available</p>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default StudentDashboard;