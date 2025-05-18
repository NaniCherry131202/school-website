import React from 'react';
import { motion } from 'framer-motion';
import data from '../assets/academics.json'; // Adjust this path if your folder structure is different

const Academics = () => {
  const { head, faculty, activities, sports } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 py-10">
      {/* Academic Head Section */}
      {head && (
        <motion.div
          className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Academic Leadership</h2>
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={head.photo}
              alt={head.name}
              className="w-40 h-40 rounded-full object-cover shadow-lg mb-6 md:mb-0 md:mr-8"
            />
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">{head.name}</h3>
              <p className="text-gray-600 mt-2">{head.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Faculty Section */}
      <motion.div
        className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Our Faculty</h2>
        <p className="text-center text-gray-600 mb-8">
          Meet our dedicated faculty members who are committed to providing the best education and guidance to our students.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faculty.map((member, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-20 h-20 rounded-full object-cover shadow-md mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-indigo-600">{member.department}</p>
                </div>
              </div>
              <p className="text-gray-600">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Extra-Curricular Activities Section */}
      <motion.div
        className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Extra-Curricular Activities</h2>
        <p className="text-center text-gray-600 mb-8">
          We believe in holistic development and offer a variety of activities to nurture creativity, confidence, and teamwork.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={activity.icon}
                  alt={activity.name}
                  className="w-16 h-16 object-cover mr-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">{activity.name}</h3>
              </div>
              <p className="text-gray-600">{activity.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Sports Section */}
      <motion.div
        className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Sports Events</h2>
        <p className="text-center text-gray-600 mb-8">
          Our sports programs encourage physical fitness, teamwork, and a spirit of healthy competition.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sports.map((sport, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center mb-4">
                <img
                  src={sport.icon}
                  alt={sport.name}
                  className="w-16 h-16 object-cover mr-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">{sport.name}</h3>
              </div>
              <p className="text-gray-600">{sport.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Academics;
