import React from 'react';
import { motion } from 'framer-motion';

const OurPartners = () => {
  return (
    <section className="relative bg-white py-32 md:py-20 overflow-y-visible mt-30">
      {/* Content */}
      <div className="container mx-auto px-4 text-center">
        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-5xl sm:text-6xl md:text-6xl font-extrabold text-black mb-6"
        >
          Our Partners
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-2xl sm:text-4xl md:text-4xl font-normal text-black max-w-7xl mx-auto mb-12"
        >
          Our success is built on collaboration. Our partners play a crucial role in making each event a reality, from funding to media coverage to logistics. We are proud to work with organizations that share our passion for spreading ideas that matter.
        </motion.p>
      </div>
    </section>
  );
};

export default OurPartners;