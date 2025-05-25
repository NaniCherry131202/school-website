import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TeacherDashboard() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classFilter, setClassFilter] = useState('');
  const [attendance, setAttendance] = useState({});
  const [marks, setMarks] = useState({});
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
        setFilteredStudents(res.data);
      } catch (err) {
        console.error('Failed to load students:', err.response?.data?.error || err.message);
        setError(err.response?.data?.error || 'Failed to load students');
        if (err.response?.status === 401) {
          window.location.href = '/login';
        }
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Filter students based on classLevel
  useEffect(() => {
    if (classFilter) {
      setFilteredStudents(students.filter(student => student.classLevel === classFilter));
    } else {
      setFilteredStudents(students);
    }
  }, [classFilter, students]);

  // Handle attendance checkbox changes
  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => {
      const newAttendance = { ...prev };
      if (newAttendance[studentId] === status) {
        delete newAttendance[studentId]; // Uncheck if same status is clicked
      } else {
        newAttendance[studentId] = status; // Set new status
      }
      return newAttendance;
    });
  };

  // Handle marks input changes
  const handleMarksChange = (studentId, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  // Handle bulk attendance submission (individual API calls)
  const handleBulkAttendance = async () => {
    if (!date || Object.keys(attendance).length === 0) {
      toast.error('Please select a date and mark attendance for at least one student.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const attendancePromises = Object.entries(attendance).map(([studentId, status]) =>
        axios.post(
          `${API_URL}/api/teacher/attendance`,
          { studentId, date, status: status.toLowerCase() },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(attendancePromises);
      toast.success('Attendance updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      setAttendance({});
      setDate('');
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

  // Handle bulk marks submission (individual API calls)
  const handleBulkMarksheet = async () => {
    if (!subject || Object.keys(marks).length === 0) {
      toast.error('Please enter a subject and marks for at least one student.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const marksPromises = Object.entries(marks).map(([studentId, mark]) =>
        axios.post(
          `${API_URL}/api/teacher/marksheet`,
          { studentId, subject, marks: parseInt(mark) },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      await Promise.all(marksPromises);
      toast.success('Marksheet updated successfully', {
        position: 'top-right',
        autoClose: 3000,
      });
      setMarks({});
      setSubject('');
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

  // Get unique class levels for filter dropdown
  const classLevels = [...new Set(students.map(student => student.classLevel))].filter(Boolean);

  return (
    <div className="min-h-screen bg-yellow-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="max-w-6xl mx-auto bg-yellow-50 p-6 rounded-lg shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img src="/logo.png" alt="Ashoka Vidya Mandir Logo" className="w-24 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-700">Teacher Dashboard</h2>

        {loadingStudents ? (
          <p className="text-center text-orange-700">Loading students...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          <>
            {/* Class Filter */}
            <div className="mb-6">
              <label className="block text-orange-700 font-semibold mb-2">Filter by Class</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">All Classes</option>
                {classLevels.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>

            {/* Bulk Marksheet Form */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-orange-700">Update Marksheet</h3>
              <div className="mb-6">
                <label className="block text-orange-700">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-orange-300">
                  <thead>
                    <tr className="bg-yellow-200">
                      <th className="p-2 border border-orange-300 text-orange-700">Roll No</th>
                      <th className="p-2 border border-orange-300 text-orange-700">Name</th>
                      <th className="p-2 border border-orange-300 text-orange-700">Class</th>
                      <th className="p-2 border border-orange-300 text-orange-700">Marks (0-100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student._id} className="hover:bg-yellow-50">
                        <td className="p-2 border border-orange-300 text-orange-700">{student.rollNo}</td>
                        <td className="p-2 border border-orange-300 text-orange-700">{student.name}</td>
                        <td className="p-2 border border-orange-300 text-orange-700">{student.classLevel}</td>
                        <td className="p-2 border border-orange-300">
                          <input
                            type="number"
                            value={marks[student._id] || ''}
                            onChange={(e) => handleMarksChange(student._id, e.target.value)}
                            className="w-full p-1 border border-orange-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                            min="0"
                            max="100"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <motion.button
                onClick={handleBulkMarksheet}
                className="w-full mt-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Marksheet'}
              </motion.button>
            </div>

            {/* Bulk Attendance Form */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-orange-700">Update Attendance</h3>
              <div className="mb-6">
                <label className="block text-orange-700">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-orange-300">
                  <thead>
                    <tr className="bg-yellow-200">
                      <th className="p-2 border border-orange-300 text-orange-700">Roll No</th>
                      <th className="p-2 border border-orange-300 text-orange-700">Name</th>
                      <th className="p-2 border border-orange-300 text-orange-700">Class</th>
                      <th className="p-2 border border-orange-300 text-orange-700">Present</th>
                      <th className="p-2 border border-orange-300 text-orange-700">Absent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student._id} className="hover:bg-yellow-50">
                        <td className="p-2 border border-orange-300 text-orange-700">{student.rollNo}</td>
                        <td className="p-2 border border-orange-300 text-orange-700">{student.name}</td>
                        <td className="p-2 border border-orange-300 text-orange-700">{student.classLevel}</td>
                        <td className="p-2 border border-orange-300 text-center">
                          <input
                            type="checkbox"
                            checked={attendance[student._id] === 'present'}
                            onChange={() => handleAttendanceChange(student._id, 'present')}
                            className="h-5 w-5"
                          />
                        </td>
                        <td className="p-2 border border-orange-300 text-center">
                          <input
                            type="checkbox"
                            checked={attendance[student._id] === 'absent'}
                            onChange={() => handleAttendanceChange(student._id, 'absent')}
                            className="h-5 w-5"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <motion.button
                onClick={handleBulkAttendance}
                className="w-full mt-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Attendance'}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

export default TeacherDashboard;