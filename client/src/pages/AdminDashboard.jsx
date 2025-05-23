import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { jwtDecode } from 'jwt-decode'; // Fixed import: Use named export

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState({
    name: '',
    description: '',
    link: '',
  });
  const [roleFilter, setRoleFilter] = useState('all');
  const [admissions, setAdmissions] = useState([]);
  const [classFilter, setClassFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const admissionRefs = useRef({});
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const currentDateTime = "01:43 PM IST, Thursday, May 22, 2025"; // Updated date and time

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);

        const headers = { Authorization: `Bearer ${token}` };
        const [usersResponse, notificationsResponse, admissionsResponse] = await Promise.all([
          axios.get(`${API_URL}/api/admin/users`, { headers }),
          axios.get(`${API_URL}/api/notifications`),
          axios.get(`${API_URL}/api/admissions`, { headers }),
        ]);

        setUsers(usersResponse.data);
        setNotifications(notificationsResponse.data);
        setAdmissions(admissionsResponse.data);
      } catch (err) {
        console.error('Fetch data error:', err.response?.data, err);
        setError(err.response?.data?.details || err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/api/admin/user/${id}`, {
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
    const { name, description } = newNotification;
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/notifications`,
        newNotification,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([response.data, ...notifications]);
      setNewNotification({ name: '', description: '', link: '' });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add notification');
    }
  };

  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`, {
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

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 190;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 10;

    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight + 10;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`admission-${id}.pdf`);
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter(u => u.role === roleFilter);
  const filteredAdmissions = classFilter === 'all' ? admissions : admissions.filter(a => a.admissionDetails.class === classFilter);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-1/4 bg-white shadow-lg p-4 h-screen overflow-y-auto">
        <h2 className="text-xl font-bold text-indigo-600 mb-4">Notifications</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications available.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="bg-gray-100 p-3 rounded-lg shadow-md relative"
              >
                <h3 className="text-lg font-semibold text-gray-800">{notification.name}</h3>
                <p className="text-gray-600">{notification.description}</p>
                {notification.link && (
                  <a
                    href={notification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {notification.link}
                  </a>
                )}
                <p className="text-sm text-gray-500 mt-1">{new Date(notification.date).toLocaleString()}</p>
                <button
                  onClick={() => handleDeleteNotification(notification._id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAddNotification} className="mt-6 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Notification Title</label>
            <input
              type="text"
              value={newNotification.name}
              onChange={(e) => setNewNotification({ ...newNotification, name: e.target.value })}
              placeholder="Enter notification title"
              className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newNotification.description}
              onChange={(e) => setNewNotification({ ...newNotification, description: e.target.value })}
              placeholder="Enter notification description"
              className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Link (optional)</label>
            <input
              type="url"
              value={newNotification.link}
              onChange={(e) => setNewNotification({ ...newNotification, link: e.target.value })}
              placeholder="Enter a URL (optional)"
              className="border rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Add Notification
          </button>
        </form>
      </aside>
      <main className="w-3/4 p-6">
        <motion.div
          className="bg-white p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6">Admin Dashboard</h2>
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
                {[...new Set(admissions.map((a) => a.admissionDetails.class))].map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-4">Manage Users</h3>
          {error && !notifications.length && <p className="text-red-600 mb-4">{error}</p>}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-2 text-center">No users found</td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
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
                    ))
                  )}
                </tbody>
              </table>
              <h3 className="text-xl font-semibold mb-4">Admission Applications</h3>
              <table className="w-full border">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="p-2">Form No</th>
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Father's Name</th>
                    <th className="p-2">Mother's Name</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Academic Year</th>
                    <th className="p-2">Photo</th>
                    <th className="p-2">Aadhaar</th>
                    <th className="p-2">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="p-2 text-center">No admissions found</td>
                    </tr>
                  ) : (
                    filteredAdmissions.map(admission => (
                      <tr key={admission._id} className="border-b">
                        <td className="p-2">{admission.formNo}</td>
                        <td className="p-2">{admission.student.name}</td>
                        <td className="p-2">{admission.father.name}</td>
                        <td className="p-2">{admission.mother.name}</td>
                        <td className="p-2">{admission.admissionDetails.class}</td>
                        <td className="p-2">{admission.admissionDetails.academicYear}</td>
                        <td className="p-2">
                          <img src={admission.photo} alt="Photo" className="h-16 object-cover" />
                        </td>
                        <td className="p-2">
                          {userRole === 'admin' ? (
                            <a
                              href={admission.aadhar}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View Aadhaar
                            </a>
                          ) : (
                            <span className="text-gray-500">Restricted</span>
                          )}
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
                    ))
                  )}
                </tbody>
              </table>
              {/* Hidden detailed views for PDF generation */}
              {filteredAdmissions.map(admission => (
                <div
                  key={admission._id}
                  ref={el => (admissionRefs.current[admission._id] = el)}
                  className="hidden p-4 bg-white text-gray-800"
                  style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold">Admission Application</h1>
                    <p className="text-sm text-gray-600">Generated on: {currentDateTime}</p>
                  </div>
                  <p className="text-center text-sm mb-6">Ashoka Vidya Mandir</p>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Application Details</h2>
                    <p><strong>Form Number:</strong> {admission.formNo}</p>
                    <p><strong>Admission Number:</strong> {admission.admissionNo || 'Not Assigned'}</p>
                    <p><strong>Submission Date:</strong> {new Date(admission.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Student Details</h2>
                    <p><strong>Name:</strong> {admission.student.name}</p>
                    <p><strong>Date of Birth:</strong> {new Date(admission.student.dob).toLocaleDateString()}</p>
                    <p><strong>Aadhaar Number:</strong> {admission.student.aadharNo}</p>
                    <p><strong>Place of Birth:</strong> {admission.student.placeOfBirth || 'N/A'}</p>
                    <p><strong>State:</strong> {admission.student.state || 'N/A'}</p>
                    <p><strong>Nationality:</strong> {admission.student.nationality || 'N/A'}</p>
                    <p><strong>Religion:</strong> {admission.student.religion || 'N/A'}</p>
                    <p><strong>Gender:</strong> {admission.student.gender}</p>
                    <p><strong>Caste:</strong> {admission.student.caste || 'N/A'}</p>
                    <p><strong>Mother Tongue:</strong> {admission.student.motherTongue || 'N/A'}</p>
                    <p><strong>Blood Group:</strong> {admission.student.bloodGroup || 'N/A'}</p>
                    <p><strong>Identification Marks:</strong> {admission.student.identificationMarks.join(', ') || 'N/A'}</p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Address Details</h2>
                    <p><strong>Residential Address:</strong> {admission.address.residentialAddress}</p>
                    <p><strong>City:</strong> {admission.address.city || 'N/A'}</p>
                    <p><strong>State:</strong> {admission.address.state || 'N/A'}</p>
                    <p><strong>Pin Code:</strong> {admission.address.pin || 'N/A'}</p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Father's Details</h2>
                    <p><strong>Name:</strong> {admission.father.name}</p>
                    <p><strong>Aadhaar Number:</strong> {admission.father.aadharNo || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {admission.father.dob ? new Date(admission.father.dob).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Occupation:</strong> {admission.father.occupation || 'N/A'}</p>
                    <p><strong>Mobile:</strong> {admission.father.mobile}</p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Mother's Details</h2>
                    <p><strong>Name:</strong> {admission.mother.name}</p>
                    <p><strong>Aadhaar Number:</strong> {admission.mother.aadharNo || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {admission.mother.dob ? new Date(admission.mother.dob).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Occupation:</strong> {admission.mother.occupation || 'N/A'}</p>
                    <p><strong>Mobile:</strong> {admission.mother.mobile}</p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Admission Details</h2>
                    <p><strong>Class:</strong> {admission.admissionDetails.class}</p>
                    <p><strong>Academic Year:</strong> {admission.admissionDetails.academicYear}</p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Previous Academic Record</h2>
                    {admission.previousAcademicRecord.length > 0 ? (
                      admission.previousAcademicRecord.map((record, index) => (
                        <div key={index} className="mb-2">
                          <p><strong>School {index + 1}:</strong></p>
                          <p><strong>Name:</strong> {record.name || 'N/A'}</p>
                          <p><strong>Location:</strong> {record.location || 'N/A'}</p>
                          <p><strong>Class:</strong> {record.class || 'N/A'}</p>
                          <p><strong>Year of Study:</strong> {record.yearOfStudy || 'N/A'}</p>
                          <p><strong>Percentage/Grade:</strong> {record.percentageOrGrade || 'N/A'}</p>
                        </div>
                      ))
                    ) : (
                      <p>No previous academic records provided.</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Appraisal</h2>
                    <p><strong>Achievements:</strong> {admission.appraisal.achievements || 'N/A'}</p>
                    <p><strong>Behavior:</strong> {admission.appraisal.behavior || 'N/A'}</p>
                    <p><strong>Health History:</strong> {admission.appraisal.healthHistory || 'N/A'}</p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Parent/Guardian Details</h2>
                    <p><strong>Name:</strong> {admission.parentGuardian.name}</p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b pb-1 mb-2">Attachments</h2>
                    <p><strong>Photo URL:</strong> <a href={admission.photo} target="_blank" rel="noopener noreferrer">{admission.photo}</a></p>
                    {userRole === 'admin' ? (
                      <p><strong>Aadhaar URL:</strong> <a href={admission.aadhar} target="_blank" rel="noopener noreferrer">{admission.aadhar}</a></p>
                    ) : (
                      <p><strong>Aadhaar URL:</strong> Restricted</p>
                    )}
                    {admission.parentGuardian.signature && (
                      <p><strong>Signature URL:</strong> <a href={admission.parentGuardian.signature} target="_blank" rel="noopener noreferrer">{admission.parentGuardian.signature}</a></p>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default AdminDashboard;