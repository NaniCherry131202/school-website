import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Admissions = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    class: '', // New field for class
    photo: null,
    aadhar: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.email || !formData.phone || !formData.dob || !formData.address || !formData.class || !formData.photo || !formData.aadhar) {
      toast.error('Please fill out all fields and upload the required files.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('email', formData.email);
    submissionData.append('phone', formData.phone);
    submissionData.append('dob', formData.dob);
    submissionData.append('address', formData.address);
    submissionData.append('class', formData.class); // Include class in submission
    submissionData.append('photo', formData.photo);
    submissionData.append('aadhar', formData.aadhar);

    try {
      // Send form data to the backend
      const response = await axios.post('http://localhost:5000/api/admissions', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success toast
      toast.success(response.data.message, {
        position: 'top-right',
        autoClose: 3000,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        class: '',
        photo: null,
        aadhar: null,
      });
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('An error occurred while submitting your application. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 py-10">
      <ToastContainer />
      <motion.div
        className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Admissions Application Form</h2>
        <p className="text-center text-gray-600 mb-8">
          Please fill out the form below to apply for admission. Ensure all fields are completed and required documents are uploaded.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your address"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Class */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Class</label>
            <select
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            >
              <option value="">Select Class</option>
              <option value="Nursery">Nursery</option>
              <option value="LKG">LKG</option>
              <option value="UKG">UKG</option>
              <option value="1st Grade">1st Grade</option>
              <option value="2nd Grade">2nd Grade</option>
              <option value="3rd Grade">3rd Grade</option>
              <option value="4th Grade">4th Grade</option>
              <option value="5th Grade">5th Grade</option>
              <option value="6th Grade">6th Grade</option>
              <option value="7th Grade">7th Grade</option>
              <option value="8th Grade">8th Grade</option>
              <option value="9th Grade">9th Grade</option>
              <option value="10th Grade">10th Grade</option>
            </select>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Upload Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          {/* Aadhaar Upload */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Upload Aadhaar Card</label>
            <input
              type="file"
              name="aadhar"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Application
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Admissions;