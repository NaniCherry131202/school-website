import React from 'react'
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div>
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
    </div>
  )
}

export default About
