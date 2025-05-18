import React from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 py-10">
      <motion.div
        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Contact Us</h2>
        <p className="text-center text-gray-600 mb-8">
          We’d love to hear from you! Reach out to us using the contact details below.
        </p>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Phone */}
          <motion.div
            className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <a href="tel:+91 9505221394" className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
                <p className="text-gray-600">+91 9505221394</p>
              </div>
            </a>
          </motion.div>

          {/* Email */}
          <motion.div
            className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <a href="mailto:nareena@ashokavidyamandir.com" className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600">nareena@ashokavidyamandir.com</p>
              </div>
            </a>
          </motion.div>

          {/* Address */}
          <motion.div
            className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <a
              href="https://maps.app.goo.gl/Ckf6fcve5sukqFJUA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">Address</h3>
                <p className="text-gray-600">20-269/1A, Indira Nagar B, Gajularamaram, Hyderabad - 500055</p>
              </div>
            </a>
          </motion.div>

          {/* Social Media */}
          <motion.div
            className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full">
              <i className="fas fa-share-alt"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Follow Us</h3>
              <div className="flex space-x-4 mt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61576177360899 "
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;