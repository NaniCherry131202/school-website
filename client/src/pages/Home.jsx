import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdmissionPopup from './AdmissionPopup';
import 'font-awesome/css/font-awesome.min.css';
import academicsData from '../assets/academics.json';

const Home = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);

  const events = academicsData.events;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRole) setRole(storedRole);

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notifications`);
        // Sort notifications by date in descending order (newest first)
        const sortedNotifications = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotifications(sortedNotifications);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    window.location.href = '/';
  };

  // Show only the latest 3 notifications initially, or all if "View All" is clicked
  const displayedNotifications = showAllNotifications ? notifications : notifications.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-yellow-300 to-orange-600 text-white py-2 fixed top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <motion.img
            src="/logo.png"
            alt="Ashoka Vidya Mandir Logo"
            className="w-[12vw] md:w-28 max-w-[80px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-6 text-sm md:text-base font-semibold items-center">
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/about" className="hover:text-indigo-200">About Us</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/academics" className="hover:text-indigo-200">Academics</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/admissions" className="hover:text-indigo-200">Admissions</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/contact" className="hover:text-indigo-200">Contact</Link>
            </motion.div>
            {role === 'student' && (
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/student" className="hover:text-indigo-200">Dashboard</Link>
              </motion.div>
            )}
            {role === 'teacher' && (
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/teacher" className="hover:text-indigo-200">Dashboard</Link>
              </motion.div>
            )}
            {role === 'admin' && (
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to="/admin" className="hover:text-indigo-200">Dashboard</Link>
              </motion.div>
            )}
            {user ? (
              <div className="relative group">
                <div className="cursor-pointer flex items-center space-x-2">
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                </div>
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg p-3 hidden group-hover:block z-50">
                  <p className="text-sm font-semibold mb-2">Hello, {user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Link to="/login" className="hover:text-indigo-200">Login</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Link to="/register" className="hover:text-indigo-200">Register</Link>
                </motion.div>
              </>
            )}
          </nav>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.nav
            className="md:hidden bg-indigo-600 text-white p-4"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/about" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            <Link to="/academics" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Academics</Link>
            <Link to="/admissions" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Admissions</Link>
            <Link to="/contact" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            {role === 'student' && (
              <Link to="/student" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            )}
            {role === 'teacher' && (
              <Link to="/teacher" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            )}
            {role === 'admin' && (
              <Link to="/admin" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block py-2 text-red-200 hover:underline w-full text-left"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block py-2 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </>
            )}
          </motion.nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-[60px]">
        {/* Hero Section */}
        <section
          className="relative flex items-center justify-center h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/main.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center text-white px-4">
            <motion.h1
              className="text-[6vw] md:text-6xl font-bold mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to Ashoka Vidya Mandir
            </motion.h1>
            <motion.p
              className="text-[3vw] md:text-xl mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Right steps will always lead you to Success
            </motion.p>
            <Link to="/admissions">
              <motion.button
                className="px-6 py-3 md:px-8 md:py-4 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-500 text-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Enroll
              </motion.button>
            </Link>
          </div>
        </section>
       <AdmissionPopup />
        {/* Notifications & Our Endeavours Side-by-Side */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Notifications Sidebar */}
              <div className="lg:w-1/3 w-full">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold mb-6 text-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Notifications
                </motion.h2>
                {loading ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-600"></div>
                  </div>
                ) : error ? (
                  <p className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>
                ) : notifications.length === 0 ? (
                  <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-lg">No notifications available.</p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {displayedNotifications.map((notification) => (
                        <motion.div
                          key={notification._id}
                          className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-center">
                              <p className="text-sm font-semibold text-gray-600 uppercase">
                                {new Date(notification.date).toLocaleString('default', { month: 'short' })}
                              </p>
                              <p className="text-xl font-bold text-gray-800">
                                {new Date(notification.date).getDate().toString().padStart(2, '0')}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(notification.date).getFullYear()}
                              </p>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <i className="fa fa-bell text-orange-600 text-lg"></i>
                                <h3 className="text-lg font-semibold text-red-600">
                                  {notification.title || 'Notification'}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Academics</p>
                              <p className="text-gray-600 text-sm mt-1">{notification.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    {notifications.length > 3 && (
                      <div className="mt-6 text-center">
                        <motion.button
                          onClick={() => setShowAllNotifications(!showAllNotifications)}
                          className="px-6 py-2 bg-transparent text-red-600 border-2 border-red-600 font-semibold rounded-full hover:bg-red-600 hover:text-white transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showAllNotifications ? 'Show Less' : 'View All'}
                        </motion.button>
                      </div>
                    )}
                  </>
                )}
              </div>
              {/* Our Endeavours */}
              <div className="lg:w-2/3 w-full">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold mb-6 text-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Our Endeavours
                </motion.h2>
                {events.length === 0 ? (
                  <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-lg">No events available.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <motion.div
                        key={event.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="relative w-full h-64">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                       
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Facilities Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Facilities
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div className="bg-white rounded-lg shadow-lg p-6 text-center" whileHover={{ scale: 1.05 }}>
                <img src="/home/classroom.jpg" alt="Classroom" className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2">Classrooms</h3>
                <p className="text-gray-600">Modern classrooms with advanced tech to enhance learning.</p>
              </motion.div>
              <motion.div className="bg-white rounded-lg shadow-lg p-6 text-center" whileHover={{ scale: 1.05 }}>
                <img src="/home/playground.jpg" alt="Playground" className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2">Playground</h3>
                <p className="text-gray-600">Spacious and safe area for physical activity and games.</p>
              </motion.div>
              <motion.div className="bg-white rounded-lg shadow-lg p-6 text-center" whileHover={{ scale: 1.05 }}>
                <img src="/home/library.jpg" alt="Library" className="w-full h-40 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-semibold mb-2">Library</h3>
                <p className="text-gray-600">Well-stocked library with books and resources for all.</p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-lg">© 2025 Ashoka Vidya Mandir. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
            >
              <i className="fa fa-facebook-f text-xl"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
            >
              <i className="fa fa-twitter text-xl"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
            >
              <i className="fa fa-instagram text-xl"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
            >
              <i className="fa fa-linkedin text-xl"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;