import React from 'react';
import { motion } from 'framer-motion';

const SpeakersShowCase = () => {
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
          Are You Someone with an Idea Worth Spreading?
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed"
        >
          We are always looking for thought leaders, innovators, and storytellers who can inspire audiences with their ideas. If you are someone who has a compelling story, groundbreaking research, or a transformative idea, we encourage you to submit a nomination!
        </motion.p>

        {/* Benefits List */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 max-w-4xl mx-auto mt-20"
        >
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-6 leading-tight"
          >
            Our ideal speakers:
          </motion.h1>
          <ul className="text-left space-y-3">
            <li>✔ Have a good, original or interesting idea or perspective worth sharing.</li>
            <li>✔ Can deliver an engaging and thought-provoking talk.</li>
            <li>✔ Are passionate about their topic and its impact on the world.</li>
            <li>✔ Can craft a clear and structured presentation.</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default SpeakersShowCase;