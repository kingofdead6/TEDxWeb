import React from 'react';
import { motion } from 'framer-motion';

const PartnersShowCase = () => {
  return (
    <section className="relative bg-white py-16 sm:py-24 lg:py-32 overflow-auto mt-10">


      

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-6 leading-tight"
        >
          Collaborate with us and Elevate Your Brand
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          By partnering with us, your organization will gain unparalleled visibility, connect with thought leaders, and contribute to a meaningful exchange of knowledge and inspiration. We welcome corporations, institutions, and organizations that align with our mission of spreading powerful ideas.
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
            As a Partner, you will:
          </motion.h1>
          <ul className="text-left space-y-3">
            <li>✔ Gain exposure to a diverse and engaged audience.</li>
            <li>✔ Align your brand with a globally recognized movement of events.</li>
            <li>✔ Network with influential changemakers and thought leaders.</li>
            <li>✔ Demonstrate your commitment to knowledge-sharing and innovation.</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnersShowCase;