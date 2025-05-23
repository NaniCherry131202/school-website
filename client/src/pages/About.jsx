import React from "react";
import { motion } from "framer-motion";

// Core Values Data with Updated Colors
const coreValues = [
  // First Row (4 items)
  [
    {
      title: "Respect",
      description: "Treating others with kindness and understanding, no matter their background or beliefs.",
      color: "bg-emerald-300",
    },
    {
      title: "Courage",
      description: "Standing up for what’s right, even when it’s hard or unpopular.",
      color: "bg-pink-400",
    },
    {
      title: "Achievement",
      description: "Celebrating both individual and group successes and encouraging excellence.",
      color: "bg-sky-400",
    },
    {
      title: "Love for Learning",
      description: "Fostering a deep curiosity and enthusiasm for knowledge in all students.",
      color: "bg-green-400",
    },
  ],
  // Second Row (3 items)
  [
    {
      title: "Honesty",
      description: "Encouraging truthfulness and integrity in actions and words.",
      color: "bg-fuchsia-400",
    },
    {
      title: "Fairness",
      description: "Ensuring everyone is treated justly and with impartiality.",
      color: "bg-yellow-300",
    },
    {
      title: "Safety",
      description: "Providing a secure and nurturing environment for all students to grow.",
      color: "bg-cyan-300",
    },
  ],
  // Third Row (4 items)
  [
    {
      title: "Diversity",
      description: "Celebrating each student’s unique qualities, culture, and perspective.",
      color: "bg-lime-300",
    },
    {
      title: "Creativity",
      description: "Inspiring original ideas and encouraging innovative thinking.",
      color: "bg-orange-300",
    },
    {
      title: "Wisdom",
      description: "Promoting thoughtful choices and reflective decision-making.",
      color: "bg-purple-400",
    },
    {
      title: "Motivation",
      description: "Encouraging self-drive and passion in every student’s journey.",
      color: "bg-teal-300",
    },
  ],
];

// Animation Variants for Staggered Entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const About = () => {
  return (
    <div>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Heading Section */}
          <div className="text-center">
            <motion.h2
              className="text-3xl sm:text-4xl font-bold mb-6 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Us
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              "Empower young minds to enlighten their potential” At ASHOKA VIDYA
              MANDIR we aim to nurture a love for learning, foster critical
              thinking, and endow every child with an exceptional learning
              experience and global edge.
            </motion.p>
          </div>

          {/* Mission, Vision, and Values */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl sm:text-[28px] font-semibold text-orange-600 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                To provide a nurturing environment where students can excel
                academically, socially, and emotionally, preparing them for a
                successful future.
              </p>
            </motion.div>

            <motion.div
              className="bg-gray-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-2xl sm:text-[28px] font-semibold text-orange-600 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                To be a leading institution that inspires innovation, fosters
                creativity, and cultivates a passion for lifelong learning.
              </p>
            </motion.div>
          </motion.div>

          {/* Core Values Heading */}
          <motion.h1
            className="text-center pt-12 pb-6 text-2xl sm:text-3xl font-semibold text-orange-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Our Core Values
          </motion.h1>

          {/* Core Values Grid - First Row (4 items) */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-8 justify-items-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {coreValues[0].map((value, index) => (
              <motion.div
                key={index}
                className={`${value.color} rounded-full p-5 shadow-lg text-center flex flex-col justify-center max-w-[200px] sm:max-w-[220px] transition-transform duration-300 hover:shadow-xl`}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  {value.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Core Values Grid - Second Row (3 items) */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mt-8 justify-items-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {coreValues[1].map((value, index) => (
              <motion.div
                key={index}
                className={`${value.color} rounded-full p-5 shadow-lg text-center flex flex-col justify-center max-w-[200px] sm:max-w-[220px] transition-transform duration-300 hover:shadow-xl`}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  {value.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Core Values Grid - Third Row (4 items) */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mt-8 justify-items-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {coreValues[2].map((value, index) => (
              <motion.div
                key={index}
                className={`${value.color} rounded-full p-5 shadow-lg text-center flex flex-col justify-center max-w-[200px] sm:max-w-[220px] transition-transform duration-300 hover:shadow-xl`}
                variants={itemVariants}
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                  {value.title}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;