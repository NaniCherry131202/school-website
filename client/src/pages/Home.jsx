import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Home = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedRole) {
      setRole(storedRole);
    }

    const fetchNotifications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/notifications');
        if (!response.ok) throw new Error('Failed to fetch notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-2 fixed top-0 z-50 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          {/* Logo */}
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
            {/* Role-Based Dashboard Link */}
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
      </header>

      {/* Main Content */}
      <main className="pt-[60px]">
        {/* Hero Section */}
        <section
          className="relative flex items-center justify-center h-screen bg-cover bg-center"
          style={{ backgroundImage: "url('/home/campus.jpg')" }}
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
              Empowering Education in Hyderabad Since 1990
            </motion.p>
            <Link to="/admissions">
              <motion.button
                className="px-6 py-3 md:px-8 md:py-4 bg-indigo-600 text-white font-semibold rounded-full shadow-lg hover:bg-indigo-700 text-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Apply Now
              </motion.button>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Us
            </motion.h2>
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              At Ashoka Vidya Mandir, we believe in holistic education that nurtures the mind, body, and soul. Established in 1990, our school has been a beacon of excellence in education, empowering students to achieve their full potential.
            </motion.p>

            {/* Mission, Vision, and Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Our Mission</h3>
                <p className="text-gray-600">
                  To provide a nurturing environment where students can excel academically, socially, and emotionally, preparing them for a successful future.
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Our Vision</h3>
                <p className="text-gray-600">
                  To be a leading institution that inspires innovation, fosters creativity, and cultivates a passion for lifelong learning.
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">Our Values</h3>
                <p className="text-gray-600">
                  Integrity, respect, excellence, and inclusivity are at the core of everything we do, shaping the leaders of tomorrow.
                </p>
              </motion.div>
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
              <i className="fab fa-facebook-f text-xl"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-200"
            >
              <i className="fab fa-linkedin-in text-xl"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;