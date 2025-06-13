import React from 'react';
import { motion } from 'framer-motion';
import BlackX from '/BlackX.png';

const ShowCase = () => {
  return (
    <section className="relative bg-white py-16 sm:py-24 lg:py-32 overflow-hidden">
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

      {/* Header Badge */}
      <div className="relative z-10 text-center px-4 mb-12" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-6 py-3 rounded-full bg-[#D9D9D9]/80 backdrop-blur-sm shadow-md"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#DE8F5A]">
            Join as a Performer for our events
          </h2>
        </motion.div>
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
          Showcase Your Talent on the Stage
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed"
        >
          We’re not just about ideas—we’re about the power of performance to inspire, challenge, and connect people. We welcome artists, musicians, dancers, spoken word poets, and performers of all kinds to be part of our events. If you have a unique performance that aligns with our spirit of curiosity and innovation, we encourage you to apply.
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
          As a performer, you will:
        </motion.h1>
          <ul className="text-center space-y-3">
            <li>✔ Gain exposure to a diverse and engaged audience</li>
            <li>✔ Be part of globally recognized events</li>
            <li>✔ Have your performance featured on our platforms</li>
            <li>✔ Connect with other artists, speakers, and changemakers</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default ShowCase;