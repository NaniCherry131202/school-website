import React from 'react';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  return (
    <div className="min-h-screen bg-yellow-100 text-orange-700 py-10">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="max-w-4xl mx-auto bg-yellow-50 p-8 rounded-lg shadow-lg border border-orange-300"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-orange-700 mb-6">Contact Us</h2>
        <p className="text-center text-orange-700 mb-8">
          We’d love to hear from you! Reach out to us using the contact details below.
        </p>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Phone */}
          <motion.div
            className="flex items-center bg-yellow-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-300"
            whileHover={{ scale: 1.05 }}
          >
            <a href="tel:+919505221394" className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-orange-700">Phone</h3>
                <p className="text-orange-700">+91 9505221394</p>
              </div>
            </a>
          </motion.div>

          {/* Email */}
          <motion.div
            className="flex items-center bg-yellow-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-300"
            whileHover={{ scale: 1.05 }}
          >
            <a href="mailto:nareena@ashokavidyamandir.com" className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-orange-700">Email</h3>
                <p className="text-orange-700">nareena@ashokavidyamandir.com</p>
              </div>
            </a>
          </motion.div>

          {/* Address */}
          <motion.div
            className="flex items-center bg-yellow-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-300"
            whileHover={{ scale: 1.05 }}
          >
            <a
              href="https://maps.app.goo.gl/Ckf6fcve5sukqFJUA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-orange-700">Address</h3>
                <p className="text-orange-700">20-269/1A, Indira Nagar B, Gajularamaram, Hyderabad - 500055</p>
              </div>
            </a>
          </motion.div>

          {/* Social Media */}
          <motion.div
            className="flex items-center bg-yellow-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-orange-300"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-full">
              <i className="fas fa-share-alt"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-orange-700">Follow Us</h3>
              <div className="flex space-x-4 mt-2">
                <a
                  href="https://www.facebook.com/profile.php?id=61576177360899"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/ashokavidyamandir/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.youtube.com/channel/UC6iP6S2kb-bVFmATiqltubA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700"
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