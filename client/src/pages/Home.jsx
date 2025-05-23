import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AdmissionPopup from './AdmissionPopup';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Updated to use Font Awesome 6
import academicsData from '../assets/academics.json';

// Config for external links
const config = {
  admissionForm: 'https://forms.gle/xNiVJpyytomJxaE78',
  enrollForm: 'https://forms.gle/VW1WKij6n1TcdE8j8',
  socialMedia: {
    facebook: 'https://www.facebook.com/profile.php?id=61576177360899',
    youtube: 'https://www.youtube.com/channel/UC6iP6S2kb-bVFmATiqltubA',
    instagram: 'https://www.instagram.com/ashokavidyamandir/',
  },
};

// Reusable NavLinks component (unchanged from previous response)
const NavLinks = ({ role, user, handleLogout, onLinkClick }) => {
  const links = [
    { to: '/about', label: 'About Us' },
    { to: '/academics', label: 'Academics' },
    { href: config.admissionForm, label: 'Admissions', external: true },
    { to: '/contact', label: 'Contact' },
    ...(role === 'student' ? [{ to: '/student', label: 'Dashboard' }] : []),
    ...(role === 'teacher' ? [{ to: '/teacher', label: 'Dashboard' }] : []),
    ...(role === 'admin' ? [{ to: '/admin', label: 'Dashboard' }] : []),
    ...(user
      ? [{ onClick: handleLogout, label: 'Logout', className: 'text-red-200 hover:underline' }]
      : [
          { to: '/login', label: 'Login' },
          { to: '/register', label: 'Register' },
        ]),
  ];

  return (
    <>
      {links.map((link, index) =>
        link.href ? (
          <a
            key={index}
            href={link.href}
            className={`hover:text-indigo-200 ${link.className || ''}`}
            onClick={onLinkClick}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
          >
            {link.label}
          </a>
        ) : (
          <Link
            key={index}
            to={link.to}
            className={`hover:text-indigo-200 ${link.className || ''}`}
            onClick={link.onClick || onLinkClick}
          >
            {link.label}
          </Link>
        )
      )}
    </>
  );
};

const Home = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const events = academicsData.events;
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRole) setRole(storedRole);

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/notifications`, {
          timeout: 5000,
        });
        const sortedNotifications = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setNotifications(sortedNotifications);
      } catch (err) {
        console.error('Fetch notifications error:', err);
        setError('Unable to load notifications. Please try again later.');
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

  const displayedNotifications = showAllNotifications ? notifications : notifications.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      {/* Header (unchanged) */}
      <header className="w-full bg-gradient-to-r from-yellow-300 to-orange-600 text-white py-2 fixed top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <motion.img
            src="/logo.png"
            alt="Ashoka Vidya Mandir Logo"
            className="w-20 sm:w-24 md:w-28 max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <nav className="hidden md:flex space-x-6 text-sm md:text-base font-semibold items-center">
            <NavLinks
              role={role}
              user={user}
              handleLogout={handleLogout}
              onLinkClick={() => {}}
            />
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                  aria-label={`Profile menu for ${user.name}`}
                >
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}`}
                    alt={`Profile picture of ${user.name}`}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg p-3 z-50">
                    <p className="text-sm font-semibold mb-2">Hello, {user.name}</p>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left text-red-600 hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
        {isMenuOpen && (
          <motion.nav
            className="md:hidden bg-indigo-600 text-white p-4 space-y-2"
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <NavLinks
              role={role}
              user={user}
              handleLogout={handleLogout}
              onLinkClick={() => setIsMenuOpen(false)}
            />
          </motion.nav>
        )}
      </header>

      <main className="pt-[60px]">
        {/* Hero Section (unchanged) */}
        <section
          className="relative flex items-center justify-center h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/main.jpg')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 text-center text-white px-4">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to Ashoka Vidya Mandir
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Right steps will always lead you to Success
            </motion.p>
            <a
              href={config.enrollForm}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Enroll now"
            >
              <motion.button
                className="px-6 py-3 md:px-8 md:py-4 bg-orange-600 text-white font-semibold rounded-full shadow-lg hover:bg-yellow-500 text-base md:text-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Enroll
              </motion.button>
            </a>
          </div>
        </section>
        <AdmissionPopup />

        {/* Notifications and Endeavours Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Notifications (unchanged) */}
              <div className="w-full lg:w-1/3">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center lg:text-left"
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
                  <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-lg">
                    No notifications available.
                  </p>
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
                                {new Date(notification.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                })}
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
                                <h3 className="text-lg font-semibold text-red-600">{notification.name}</h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">Academics</p>
                              <p className="text-gray-600 text-sm mt-1">{notification.description}</p>
                              {notification.link && (
                                <a
                                  href={notification.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm mt-1 block"
                                >
                                  {notification.link}
                                </a>
                              )}
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

              {/* Endeavours Section - Updated */}
              <div className="w-full lg:w-2/3">
                <motion.h2
                  className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center lg:text-left"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Our Endeavours
                </motion.h2>
                {events.length === 0 ? (
                  <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-lg">
                    No events available.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <motion.div
                        key={event.id}
                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="relative w-full">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-auto object-contain rounded-t-lg"
                            loading="lazy"
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

        {/* Facilities Section - Updated */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Our Facilities
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="/home/classroom.jpg"
                  alt="Modern Classroom"
                  className="w-full h-auto object-contain rounded-md mb-4"
                  loading="lazy"
                />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Classrooms</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Modern classrooms with advanced tech to enhance learning.
                </p>
              </motion.div>
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="/home/playarea.jpg"
                  alt="Playground Area"
                  className="w-full h-auto object-contain rounded-md mb-4"
                  loading="lazy"
                />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Play Area</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Safe area for physical activities.
                </p>
              </motion.div>
              <motion.div
                className="bg-white rounded-lg shadow-lg p-6 text-center"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="/home/computerlearn.jpg"
                  alt="Computer Learning Lab"
                  className="w-full h-auto object-contain rounded-md mb-4"
                  loading="lazy"
                />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Computer Learning</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Future coders start from here!
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer (unchanged) */}
      <footer className="bg-gradient-to-r from-yellow-300 to-orange-600 text-white py-8">
        <div className="container mx-auto text-center">
          <p className="text-base sm:text-lg">© 2025 Ashoka Vidya Mandir. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a
              href={config.socialMedia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
              aria-label="Visit our Facebook page"
            >
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href={config.socialMedia.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
              aria-label="Visit our YouTube channel"
            >
              <i className="fab fa-youtube text-xl"></i>
            </a>
            <a
              href={config.socialMedia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
              aria-label="Visit our Instagram page"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;