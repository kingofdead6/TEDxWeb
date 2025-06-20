import React from 'react';
import { motion } from 'framer-motion';
import BlackX from '/BlackX.png';

const ReserveShowCase = () => {
  return (
    <section className="relative bg-white py-16 sm:py-24 lg:py-32 overflow-hidden mt-10">
      {/* Dotted Pattern Background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: 20, opacity: 0.2 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
          className="absolute bottom-0 left-0 w-1/3 md:w-1/4 h-full bg-no-repeat bg-left-bottom bg-contain hidden md:block"
          style={{ backgroundImage: `url(${BlackX})` }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-black mb-6 leading-tight"
        >
          Join an Upcoming TEDx Event
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed"
        >
          Experience the power of ideas worth spreading! Register now to attend one of our upcoming TEDx events and be part of an inspiring day filled with thought-provoking talks, engaging discussions, and networking opportunities.
        </motion.p>
      </div>
    </section>
  );
};

export default ReserveShowCase;