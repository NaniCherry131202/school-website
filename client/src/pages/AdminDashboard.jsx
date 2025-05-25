import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { jwtDecode } from 'jwt-decode';

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
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const admissionRefs = useRef({});
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const currentDateTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }); // Dynamic IST date: e.g., "04:06 PM IST, Sunday, May 25, 2025"

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        toast.error('Please log in to access the dashboard.', { position: 'top-right', autoClose: 3000 });
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
        const errorMsg = err.response?.data?.details || err.response?.data?.message || 'Failed to fetch data';
        setError(errorMsg);
        toast.error(errorMsg, { position: 'top-right', autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user._id !== id));
      toast.success('User deleted successfully.', { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete user';
      toast.error(errorMsg, { position: 'top-right', autoClose: 3000 });
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNotification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const { name, description } = newNotification;
    if (!name.trim() || !description.trim()) {
      toast.error('Name and description are required.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    setActionLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/notifications`,
        newNotification,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications([response.data, ...notifications]);
      setNewNotification({ name: '', description: '', link: '' });
      toast.success('Notification added successfully.', { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to add notification';
      toast.error(errorMsg, { position: 'top-right', autoClose: 3000 });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    const token = localStorage.getItem('token');
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(notifications.filter((n) => n._id !== id));
      toast.success('Notification deleted successfully.', { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete notification';
      toast.error(errorMsg, { position: 'top-right', autoClose: 3000 });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPDF = async (id) => {
    const element = admissionRefs.current[id];
    if (!element) {
      toast.error('Failed to generate PDF: Content not found.', { position: 'top-right', autoClose: 3000 });
      return;
    }

    setActionLoading(true);
    try {
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
      toast.success('PDF downloaded successfully.', { position: 'top-right', autoClose: 3000 });
    } catch (err) {
      toast.error('Failed to generate PDF.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter);
  const filteredAdmissions =
    classFilter === 'all' ? admissions : admissions.filter((a) => a.admissionDetails.class === classFilter);

  return (
    <div className="min-h-screen bg-yellow-100 flex">
      <ToastContainer position="top-right" autoClose={3000} />
      <aside className="w-1/4 bg-yellow-50 shadow-lg p-4 h-screen overflow-y-auto border-r border-orange-300">
        <h2 className="text-xl font-bold text-orange-700 mb-4">Notifications</h2>
        {error && <p className="text-orange-600 mb-4">{error}</p>}
        {notifications.length === 0 ? (
          <p className="text-orange-700">No notifications available.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="bg-yellow-100 p-3 rounded-lg shadow-md relative border border-orange-300"
              >
                <h3 className="text-lg font-semibold text-orange-700">{notification.name}</h3>
                <p className="text-orange-700">{notification.description}</p>
                {notification.link && (
                  <a
                    href={notification.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 text-sm"
                  >
                    {notification.link}
                  </a>
                )}
                <p className="text-sm text-orange-700 mt-1">{new Date(notification.date).toLocaleString()}</p>
                <button
                  onClick={() => handleDeleteNotification(notification._id)}
                  className="absolute top-2 right-2 text-orange-600 hover:text-orange-700"
                  disabled={actionLoading}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleAddNotification} className="mt-6 space-y-3">
          <div>
            <label htmlFor="notification-title" className="block text-sm font-medium text-orange-700">
              Notification Title
            </label>
            <input
              id="notification-title"
              type="text"
              value={newNotification.name}
              onChange={(e) => setNewNotification({ ...newNotification, name: e.target.value })}
              placeholder="Enter notification title"
              className="border border-orange-300 rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label htmlFor="notification-desc" className="block text-sm font-medium text-orange-700">
              Description
            </label>
            <textarea
              id="notification-desc"
              value={newNotification.description}
              onChange={(e) => setNewNotification({ ...newNotification, description: e.target.value })}
              placeholder="Enter notification description"
              className="border border-orange-300 rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="3"
            />
          </div>
          <div>
            <label htmlFor="notification-link" className="block text-sm font-medium text-orange-700">
              Link (optional)
            </label>
            <input
              id="notification-link"
              type="url"
              value={newNotification.link}
              onChange={(e) => setNewNotification({ ...newNotification, link: e.target.value })}
              placeholder="Enter a URL (optional)"
              className="border border-orange-300 rounded px-3 py-1 w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full disabled:bg-orange-300"
            disabled={actionLoading}
          >
            {actionLoading ? 'Adding...' : 'Add Notification'}
          </button>
        </form>
      </aside>
      <main className="w-3/4 p-6">
        <motion.div
          className="bg-yellow-50 p-6 rounded-lg shadow-lg border border-orange-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center text-orange-700 mb-6">Admin Dashboard</h2>
          <div className="flex justify-between mb-4">
            <div>
              <label htmlFor="role-filter" className="font-semibold text-orange-700 mr-2">
                Filter by Role:
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-orange-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="class-filter" className="font-semibold text-orange-700 mr-2">
                Filter by Class:
              </label>
              <select
                id="class-filter"
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="border border-orange-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All</option>
                {[...new Set(admissions.map((a) => a.admissionDetails.class))].map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-orange-700 mb-4">Manage Users</h3>
          {error && !notifications.length && <p className="text-orange-600 mb-4">{error}</p>}
          {loading ? (
            <p className="text-orange-700">Loading...</p>
          ) : (
            <>
              <table className="w-full border mb-6">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-2 text-center text-orange-700">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b border-orange-300">
                        <td className="p-2 text-orange-700">{user.name}</td>
                        <td className="p-2 text-orange-700">{user.email}</td>
                        <td className="p-2 text-orange-700 capitalize">{user.role}</td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700 disabled:bg-orange-300"
                            disabled={actionLoading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <h3 className="text-xl font-semibold text-orange-700 mb-4">Admission Applications</h3>
              <table className="w-full border">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="p-2">Form No</th>
                    <th className="p-2">Student Name</th>
                    <th className="p-2">Father's Name</th>
                    <th className="p-2">Mother's Name</th>
                    <th className="p-2">Class</th>
                    <th className="p-2">Academic Year</th>
                    <th className="p-2">Photo</th>
                    <th className="p-2">Aadhaar</th>
                    <th className="p-2">Birth Certificate</th>
                    <th className="p-2">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmissions.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="p-2 text-center text-orange-700">
                        No admissions found
                      </td>
                    </tr>
                  ) : (
                    filteredAdmissions.map((admission) => (
                      <tr key={admission._id} className="border-b border-orange-300">
                        <td className="p-2 text-orange-700">{admission.formNo}</td>
                        <td className="p-2 text-orange-700">{admission.student.name}</td>
                        <td className="p-2 text-orange-700">{admission.father.name}</td>
                        <td className="p-2 text-orange-700">{admission.mother.name}</td>
                        <td className="p-2 text-orange-700">{admission.admissionDetails.class}</td>
                        <td className="p-2 text-orange-700">{admission.admissionDetails.academicYear}</td>
                        <td className="p-2">
                          <img
                            src={admission.photo}
                            alt={`${admission.student.name}'s photo`}
                            className="h-16 object-cover"
                          />
                        </td>
                        <td className="p-2">
                          {userRole === 'admin' ? (
                            <a
                              href={admission.aadhar}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-700"
                            >
                              View Aadhaar
                            </a>
                          ) : (
                            <span className="text-orange-700">Restricted</span>
                          )}
                        </td>
                        <td className="p-2">
                          {userRole === 'admin' ? (
                            <a
                              href={admission.birthCertificate}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 hover:text-orange-700"
                            >
                              View Birth Certificate
                            </a>
                          ) : (
                            <span className="text-orange-700">Restricted</span>
                          )}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => handleDownloadPDF(admission._id)}
                            className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:bg-orange-300"
                            disabled={actionLoading}
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
              {filteredAdmissions.map((admission) => (
                <div
                  key={admission._id}
                  ref={(el) => (admissionRefs.current[admission._id] = el)}
                  className="hidden p-4 bg-yellow-50 text-orange-700"
                  style={{ width: '210mm', minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}
                >
                  <div className="flex justify-between mb-4">
                    <h1 className="text-2xl font-bold text-orange-700">Admission Application</h1>
                    <p className="text-sm text-orange-700">Generated on: {currentDateTime}</p>
                  </div>
                  <p className="text-center text-sm text-orange-700 mb-6">Ashoka Vidya Mandir</p>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Application Details
                    </h2>
                    <p>
                      <strong>Form Number:</strong> {admission.formNo}
                    </p>
                    <p>
                      <strong>Admission Number:</strong> {admission.admissionNo || 'Not Assigned'}
                    </p>
                    <p>
                      <strong>Submission Date:</strong> {new Date(admission.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Student Details
                    </h2>
                    <p>
                      <strong>Name:</strong> {admission.student.name}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong> {new Date(admission.student.dob).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Aadhaar Number:</strong> {admission.student.aadharNo}
                    </p>
                    <p>
                      <strong>Place of Birth:</strong> {admission.student.placeOfBirth || 'N/A'}
                    </p>
                    <p>
                      <strong>State:</strong> {admission.student.state || 'N/A'}
                    </p>
                    <p>
                      <strong>Nationality:</strong> {admission.student.nationality || 'N/A'}
                    </p>
                    <p>
                      <strong>Religion:</strong> {admission.student.religion || 'N/A'}
                    </p>
                    <p>
                      <strong>Gender:</strong> {admission.student.gender}
                    </p>
                    <p>
                      <strong>Caste:</strong> {admission.student.caste || 'N/A'}
                    </p>
                    <p>
                      <strong>Mother Tongue:</strong> {admission.student.motherTongue || 'N/A'}
                    </p>
                    <p>
                      <strong>Blood Group:</strong> {admission.student.bloodGroup || 'N/A'}
                    </p>
                    <p>
                      <strong>Identification Marks:</strong>{' '}
                      {admission.student.identificationMarks.join(', ') || 'N/A'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Address Details
                    </h2>
                    <p>
                      <strong>Residential Address:</strong> {admission.address.residentialAddress}
                    </p>
                    <p>
                      <strong>City:</strong> {admission.address.city || 'N/A'}
                    </p>
                    <p>
                      <strong>State:</strong> {admission.address.state || 'N/A'}
                    </p>
                    <p>
                      <strong>Pin Code:</strong> {admission.address.pin || 'N/A'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Father's Details
                    </h2>
                    <p>
                      <strong>Name:</strong> {admission.father.name}
                    </p>
                    <p>
                      <strong>Aadhaar Number:</strong> {admission.father.aadharNo || 'N/A'}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{' '}
                      {admission.father.dob ? new Date(admission.father.dob).toLocaleDateString() : 'N/A'}
                    </p>
                    <p>
                      <strong>Occupation:</strong> {admission.father.occupation || 'N/A'}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {admission.father.mobile}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Mother's Details
                    </h2>
                    <p>
                      <strong>Name:</strong> {admission.mother.name}
                    </p>
                    <p>
                      <strong>Aadhaar Number:</strong> {admission.mother.aadharNo || 'N/A'}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{' '}
                      {admission.mother.dob ? new Date(admission.mother.dob).toLocaleDateString() : 'N/A'}
                    </p>
                    <p>
                      <strong>Occupation:</strong> {admission.mother.occupation || 'N/A'}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {admission.mother.mobile}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Admission Details
                    </h2>
                    <p>
                      <strong>Class:</strong> {admission.admissionDetails.class}
                    </p>
                    <p>
                      <strong>Academic Year:</strong> {admission.admissionDetails.academicYear}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Previous Academic Record
                    </h2>
                    {admission.previousAcademicRecord.length > 0 ? (
                      admission.previousAcademicRecord.map((record, index) => (
                        <div key={index} className="mb-2">
                          <p>
                            <strong>School {index + 1}:</strong>
                          </p>
                          <p>
                            <strong>Name:</strong> {record.name || 'N/A'}
                          </p>
                          <p>
                            <strong>Location:</strong> {record.location || 'N/A'}
                          </p>
                          <p>
                            <strong>Class:</strong> {record.class || 'N/A'}
                          </p>
                          <p>
                            <strong>Year of Study:</strong> {record.yearOfStudy || 'N/A'}
                          </p>
                          <p>
                            <strong>Percentage/Grade:</strong> {record.percentageOrGrade || 'N/A'}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No previous academic records provided.</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Appraisal
                    </h2>
                    <p>
                      <strong>Achievements:</strong> {admission.appraisal.achievements || 'N/A'}
                    </p>
                    <p>
                      <strong>Behavior:</strong> {admission.appraisal.behavior || 'N/A'}
                    </p>
                    <p>
                      <strong>Health History:</strong> {admission.appraisal.healthHistory || 'N/A'}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Parent/Guardian Details
                    </h2>
                    <p>
                      <strong>Name:</strong> {admission.parentGuardian.name}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xl font-semibold border-b border-orange-300 pb-1 mb-2 text-orange-700">
                      Attachments
                    </h2>
                    <p>
                      <strong>Photo URL:</strong>{' '}
                      <a href={admission.photo} target="_blank" rel="noopener noreferrer">
                        {admission.photo}
                      </a>
                    </p>
                    {userRole === 'admin' ? (
                      <p>
                        <strong>Aadhaar URL:</strong>{' '}
                        <a href={admission.aadhar} target="_blank" rel="noopener noreferrer">
                          {admission.aadhar}
                        </a>
                      </p>
                    ) : (
                      <p>
                        <strong>Aadhaar URL:</strong> Restricted
                      </p>
                    )}
                    {userRole === 'admin' ? (
                      <p>
                        <strong>Birth Certificate URL:</strong>{' '}
                        <a href={admission.birthCertificate} target="_blank" rel="noopener noreferrer">
                          {admission.birthCertificate}
                        </a>
                      </p>
                    ) : (
                      <p>
                        <strong>Birth Certificate URL:</strong> Restricted
                      </p>
                    )}
                    {admission.parentGuardian.signature && (
                      <p>
                        <strong>Signature URL:</strong>{' '}
                        <a
                          href={admission.parentGuardian.signature}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {admission.parentGuardian.signature}
                        </a>
                      </p>
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