import React from 'react';
import { motion } from 'framer-motion';

const VolunteerShowCase = () => {
  return (
    <section className="relative bg-white py-16 sm:py-24 lg:py-32 overflow-hidden mt-10">


      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-6 leading-tight"
        >
          Be Part of Something Bigger!
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed"
        >
          Whether you’re a student, professional, or simply someone eager to contribute, volunteering with us gives you the opportunity to work behind the scenes, develop new skills, and be part of an inspiring community.
        </motion.p>

        {/* Benefits List */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 max-w-4xl mx-auto"
        >
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-6 leading-tight mt-20"
        >
          As a volunteer, you will:
        </motion.h1>
          <ul className="text-left space-y-3">
            <li>✔ Gain hands-on experience in event management, logistics, and coordination</li>
            <li>✔ Connect with inspiring speakers, organizers, and fellow volunteers</li>
            <li>✔ Contribute to bringing transformative ideas to life</li>
            <li>✔ Receive an official volunteer certificate recognizing your efforts</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default VolunteerShowCase;