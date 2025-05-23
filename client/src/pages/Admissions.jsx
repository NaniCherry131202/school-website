import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Admissions = () => {
  const [formData, setFormData] = useState({
    student: {
      name: '',
      dob: '',
      aadharNo: '',
      placeOfBirth: '',
      state: '',
      nationality: '',
      religion: '',
      gender: '',
      caste: '',
      motherTongue: '',
      bloodGroup: '',
      identificationMarks: ['', ''],
    },
    address: {
      residentialAddress: '',
      city: '',
      state: '',
      pin: '',
    },
    father: {
      name: '',
      aadharNo: '',
      dob: '',
      occupation: '',
      mobile: '',
    },
    mother: {
      name: '',
      aadharNo: '',
      dob: '',
      occupation: '',
      mobile: '',
    },
    admissionDetails: {
      class: '',
      academicYear: '',
    },
    previousAcademicRecord: [{ name: '', location: '', class: '', yearOfStudy: '', percentageOrGrade: '' }],
    appraisal: {
      achievements: '',
      behavior: '',
      healthHistory: '',
    },
    parentGuardian: {
      name: '',
    },
    photo: null,
    aadhar: null,
    signature: null,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;
    if (section) {
      if (section === 'previousAcademicRecord') {
        const updatedRecords = [...formData.previousAcademicRecord];
        updatedRecords[index] = { ...updatedRecords[index], [name]: value };
        setFormData({ ...formData, previousAcademicRecord: updatedRecords });
      } else if (section === 'identificationMarks') {
        const updatedMarks = [...formData.student.identificationMarks];
        updatedMarks[index] = value;
        setFormData({
          ...formData,
          student: { ...formData.student, identificationMarks: updatedMarks },
        });
      } else {
        setFormData({
          ...formData,
          [section]: { ...formData[section], [name]: value },
        });
      }
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const addPreviousSchool = () => {
    setFormData({
      ...formData,
      previousAcademicRecord: [
        ...formData.previousAcademicRecord,
        { name: '', location: '', class: '', yearOfStudy: '', percentageOrGrade: '' },
      ],
    });
  };

  const removePreviousSchool = (index) => {
    setFormData({
      ...formData,
      previousAcademicRecord: formData.previousAcademicRecord.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      formData.student.name,
      formData.student.dob,
      formData.student.aadharNo,
      formData.student.gender,
      formData.address.residentialAddress,
      formData.father.name,
      formData.father.mobile,
      formData.mother.name,
      formData.mother.mobile,
      formData.admissionDetails.class,
      formData.admissionDetails.academicYear,
      formData.parentGuardian.name,
      formData.photo,
      formData.aadhar,
    ];

    if (requiredFields.some((field) => !field)) {
      toast.error('Please fill out all required fields and upload required files.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    // Prepare form data for submission
    const submissionData = new FormData();
    submissionData.append('student', JSON.stringify(formData.student));
    submissionData.append('address', JSON.stringify(formData.address));
    submissionData.append('father', JSON.stringify(formData.father));
    submissionData.append('mother', JSON.stringify(formData.mother));
    submissionData.append('admissionDetails', JSON.stringify(formData.admissionDetails));
    submissionData.append('previousAcademicRecord', JSON.stringify(formData.previousAcademicRecord));
    submissionData.append('appraisal', JSON.stringify(formData.appraisal));
    submissionData.append('parentGuardian', JSON.stringify(formData.parentGuardian));
    submissionData.append('photo', formData.photo);
    submissionData.append('aadhar', formData.aadhar);
    if (formData.signature) submissionData.append('signature', formData.signature);

    try {
      const response = await axios.post(`${API_URL}/api/admissions`, submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success message with generated Form Number
      toast.success(`${response.data.message} Your Form Number is ${response.data.formNo}.`, {
        position: 'top-right',
        autoClose: 5000,
      });

      // Reset form
      setFormData({
        student: {
          name: '',
          dob: '',
          aadharNo: '',
          placeOfBirth: '',
          state: '',
          nationality: '',
          religion: '',
          gender: '',
          caste: '',
          motherTongue: '',
          bloodGroup: '',
          identificationMarks: ['', ''],
        },
        address: {
          residentialAddress: '',
          city: '',
          state: '',
          pin: '',
        },
        father: {
          name: '',
          aadharNo: '',
          dob: '',
          occupation: '',
          mobile: '',
        },
        mother: {
          name: '',
          aadharNo: '',
          dob: '',
          occupation: '',
          mobile: '',
        },
        admissionDetails: {
          class: '',
          academicYear: '',
        },
        previousAcademicRecord: [{ name: '', location: '', class: '', yearOfStudy: '', percentageOrGrade: '' }],
        appraisal: {
          achievements: '',
          behavior: '',
          healthHistory: '',
        },
        parentGuardian: {
          name: '',
        },
        photo: null,
        aadhar: null,
        signature: null,
      });

      // Reset file inputs
      document.getElementById('photo').value = '';
      document.getElementById('aadhar').value = '';
      document.getElementById('signature').value = '';
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.response?.data?.message || 'An error occurred while submitting your application.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 py-10">
      <ToastContainer />
      <motion.div
        className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Admissions Application Form</h2>
        <p className="text-center text-gray-600 mb-8">
          Please fill out the form below to apply for admission at Ashoka Vidya Mandir. All fields marked with * are required.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Student Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Student Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.student.name}
                  onChange={(e) => handleChange(e, 'student')}
                  placeholder="Enter student's full name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.student.dob}
                  onChange={(e) => handleChange(e, 'student')}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Aadhaar Number *</label>
                <input
                  type="text"
                  name="aadharNo"
                  value={formData.student.aadharNo}
                  onChange={(e) => handleChange(e, 'student')}
                  placeholder="Enter Aadhaar number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Place of Birth</label>
                <input
                  type="text"
                  name="placeOfBirth"
                  value={formData.student.placeOfBirth}
                  onChange={(e) => handleChange(e, 'student')}
                  placeholder="Enter place of birth"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.student.state}
                  onChange={(e) => handleChange(e, 'student')}
                  placeholder="Enter state"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.student.nationality}
                  onChange={(e) => handleChange(e, 'student')}
                  placeholder="Enter nationality"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.student.religion}
                  onChange={(e) => handleChange(e, 'student')}
                  placeholder="Enter religion"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Gender *</label>
                <select
                  name="gender"
                  value={formData.student.gender}
                  onChange={(e) => handleChange(e, 'student')}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Caste</label>
                <select
                  name="caste"
                  value={formData.student.caste}
                  onChange={(e) => handleChange(e, 'student')}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Caste</option>
                  <option value="BC">BC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OC">OC</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Mother Tongue</label>
                <input
                  type="text"
                  name="motherTongue"
                  value={formData.student.motherTongue}
                  onChange={(e) => handleChange(e, 'student')}
                  placeholder="Enter mother tongue"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Blood Group</label>
                <input
                  type="text"
                  name="bloodGroup"
                  value={formData.student.bloodGroup}
                  onChange={(e) => handleChange(e, 'student')}
                  placeholder="Enter blood group"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 font-semibold mb-2">Identification Marks</label>
              <input
                type="text"
                name="identificationMarks0"
                value={formData.student.identificationMarks[0]}
                onChange={(e) => handleChange(e, 'identificationMarks', 0)}
                placeholder="Identification mark 1"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-2"
              />
              <input
                type="text"
                name="identificationMarks1"
                value={formData.student.identificationMarks[1]}
                onChange={(e) => handleChange(e, 'identificationMarks', 1)}
                placeholder="Identification mark 2"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          {/* Address Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Address Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Residential Address *</label>
                <textarea
                  name="residentialAddress"
                  value={formData.address.residentialAddress}
                  onChange={(e) => handleChange(e, 'address')}
                  placeholder="Enter residential address"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={(e) => handleChange(e, 'address')}
                  placeholder="Enter city"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={(e) => handleChange(e, 'address')}
                  placeholder="Enter state"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Pin Code</label>
                <input
                  type="text"
                  name="pin"
                  value={formData.address.pin}
                  onChange={(e) => handleChange(e, 'address')}
                  placeholder="Enter pin code"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Father Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Father's Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.father.name}
                  onChange={(e) => handleChange(e, 'father')}
                  placeholder="Enter father's full name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadharNo"
                  value={formData.father.aadharNo}
                  onChange={(e) => handleChange(e, 'father')}
                  placeholder="Enter Aadhaar number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.father.dob}
                  onChange={(e) => handleChange(e, 'father')}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.father.occupation}
                  onChange={(e) => handleChange(e, 'father')}
                  placeholder="Enter occupation"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.father.mobile}
                  onChange={(e) => handleChange(e, 'father')}
                  placeholder="Enter mobile number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Mother Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Mother's Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.mother.name}
                  onChange={(e) => handleChange(e, 'mother')}
                  placeholder="Enter mother's full name"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadharNo"
                  value={formData.mother.aadharNo}
                  onChange={(e) => handleChange(e, 'mother')}
                  placeholder="Enter Aadhaar number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.mother.dob}
                  onChange={(e) => handleChange(e, 'mother')}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.mother.occupation}
                  onChange={(e) => handleChange(e, 'mother')}
                  placeholder="Enter occupation"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mother.mobile}
                  onChange={(e) => handleChange(e, 'mother')}
                  placeholder="Enter mobile number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Admission Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Admission Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Class *</label>
                <select
                  name="class"
                  value={formData.admissionDetails.class}
                  onChange={(e) => handleChange(e, 'admissionDetails')}
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
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Academic Year *</label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.admissionDetails.academicYear}
                  onChange={(e) => handleChange(e, 'admissionDetails')}
                  placeholder="e.g., 2025-2026"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
            </div>
          </div>

          {/* Previous Academic Record */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Previous Academic Record</h3>
            {formData.previousAcademicRecord.map((record, index) => (
              <div key={index} className="border p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">School Name</label>
                    <input
                      type="text"
                      name="name"
                      value={record.name}
                      onChange={(e) => handleChange(e, 'previousAcademicRecord', index)}
                      placeholder="Enter school name"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={record.location}
                      onChange={(e) => handleChange(e, 'previousAcademicRecord', index)}
                      placeholder="Enter location"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Class</label>
                    <input
                      type="text"
                      name="class"
                      value={record.class}
                      onChange={(e) => handleChange(e, 'previousAcademicRecord', index)}
                      placeholder="Enter class"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Year of Study</label>
                    <input
                      type="text"
                      name="yearOfStudy"
                      value={record.yearOfStudy}
                      onChange={(e) => handleChange(e, 'previousAcademicRecord', index)}
                      placeholder="e.g., 2024-2025"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Percentage/Grade</label>
                    <input
                      type="text"
                      name="percentageOrGrade"
                      value={record.percentageOrGrade}
                      onChange={(e) => handleChange(e, 'previousAcademicRecord', index)}
                      placeholder="e.g., 85% or A+"
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>
                {formData.previousAcademicRecord.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePreviousSchool(index)}
                    className="mt-2 text-red-600 hover:underline"
                  >
                    Remove School
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPreviousSchool}
              className="text-indigo-600 hover:underline"
            >
              Add Another School
            </button>
          </div>

          {/* Appraisal */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Appraisal of Your Child</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Achievements</label>
                <textarea
                  name="achievements"
                  value={formData.appraisal.achievements}
                  onChange={(e) => handleChange(e, 'appraisal')}
                  placeholder="Enter academic or extracurricular achievements"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  rows="4"
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">General Behavior</label>
                <select
                  name="behavior"
                  value={formData.appraisal.behavior}
                  onChange={(e) => handleChange(e, 'appraisal')}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Select Behavior</option>
                  <option value="Mild">Mild</option>
                  <option value="Normal">Normal</option>
                  <option value="Hyperactive">Hyperactive</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Health History</label>
                <textarea
                  name="healthHistory"
                  value={formData.appraisal.healthHistory}
                  onChange={(e) => handleChange(e, 'appraisal')}
                  placeholder="Enter any history of illness, allergies, or conditions"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  rows="4"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Details */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Parent/Guardian Details</h3>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.parentGuardian.name}
                onChange={(e) => handleChange(e, 'parentGuardian')}
                placeholder="Enter parent/guardian name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">File Uploads</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Upload Photo *</label>
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Upload Aadhaar Card *</label>
                <input
                  type="file"
                  id="aadhar"
                  name="aadhar"
                  accept="application/pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Upload Signature (Optional)</label>
                <input
                  type="file"
                  id="signature"
                  name="signature"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
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