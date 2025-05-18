// Updated AdminDashboard.jsx with image rendering in PDF and user management section

import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [admissions, setAdmissions] = useState([]);
  const [classFilter, setClassFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const admissionRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersResponse, notificationsResponse, admissionsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/users", { headers }),
          axios.get("http://localhost:5000/api/notifications", { headers }),
          axios.get("http://localhost:5000/api/admissions", { headers })
        ]);

        setUsers(usersResponse.data);
        setNotifications(notificationsResponse.data);
        setAdmissions(admissionsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!newNotification.trim()) return;

    try {
      const response = await axios.post(
        'http://localhost:5000/api/notifications',
        { text: newNotification },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([response.data, ...notifications]);
      setNewNotification('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add notification');
    }
  };

  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notification');
    }
  };

  const handleDownloadPDF = async (id) => {
    const element = admissionRefs.current[id];
    if (!element) return;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('admission-details.pdf');
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);
  const filteredAdmissions = classFilter === 'all' ? admissions : admissions.filter(a => a.class === classFilter);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Notifications Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg p-4 h-screen overflow-y-auto">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications available.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="bg-gray-100 p-3 rounded-lg shadow-md relative"
              >
                <h3 className="text-lg font-semibold text-gray-800">Notification</h3>
                <p className="text-gray-600">{notification.text}</p>
                <p className="text-sm text-gray-500 mt-1">{new Date(notification.date).toLocaleString()}</p>
                <button onClick={() => handleDeleteNotification(notification._id)} className="absolute top-2 right-2 text-red-600">&times;</button>
              </li>
            ))}
          </ul>
        )}

        {/* Add Notification Form */}
        <form onSubmit={handleAddNotification} className="mt-6">
          <input
            type="text"
            value={newNotification}
            onChange={(e) => setNewNotification(e.target.value)}
            placeholder="Enter new notification"
            className="border rounded px-3 py-1 w-full mb-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 w-full"
          >
            Add Notification
          </button>
        </form>
      </aside>

      {/* Main Dashboard Content */}
      <main className="w-3/4 p-6">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>

          {/* Filters */}
          <div className="flex justify-between mb-4">
            <div>
              <label className="font-semibold mr-2">Filter by Role:</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="all">All</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="font-semibold mr-2">Filter by Class:</label>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="border rounded px-3 py-1"
              >
                <option value="all">All</option>
                {[...new Set(admissions.map((a) => a.class))].map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
          <table className="w-full border mb-6">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id} className="border-b">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Admissions Table */}
          <h3 className="text-xl font-semibold mb-4">Admission Applications</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">DOB</th>
                <th className="p-2">Class</th>
                <th className="p-2">Photo</th>
                <th className="p-2">Aadhar</th>
                <th className="p-2">PDF</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.map(admission => (
                <tr key={admission._id} ref={el => admissionRefs.current[admission._id] = el} className="border-b">
                  <td className="p-2">{admission.name}</td>
                  <td className="p-2">{admission.email}</td>
                  <td className="p-2">{admission.phone}</td>
                  <td className="p-2">{new Date(admission.dob).toLocaleDateString()}</td>
                  <td className="p-2">{admission.class}</td>
                  <td className="p-2">
                    <img src={`http://localhost:5000/${admission.photo}`} alt="Photo" className="h-16" />
                  </td>
                  <td className="p-2">
                    <img src={`http://localhost:5000/${admission.aadhar}`} alt="Aadhar" className="h-16" />
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDownloadPDF(admission._id)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </main>
    </div>
  );
}

export default AdminDashboard;
