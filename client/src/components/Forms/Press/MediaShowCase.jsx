import React from 'react';
import { motion } from 'framer-motion';

const MediaShowCase = () => {
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
          Be Part of the Experience as a Media Representative
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-lg sm:text-xl md:text-2xl font-normal text-gray-800 max-w-4xl mx-auto mb-8 leading-relaxed"
        >
          We welcome journalists, bloggers, photographers, and media professionals who want to cover our events and share groundbreaking ideas with a wider audience. Whether you're from a major publication, an independent media outlet, or a social media influencer passionate about storytelling, we invite you to apply for media access.
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
       As a media grantee, you’ll get:
        </motion.h1>
          <ul className="text-left space-y-3">
            <li>✔ Exclusive behind-the-scenes access to our events</li>
            <li>✔ Interviews with speakers, organizers, and attendees</li>
            <li>✔ High-quality content and visuals for your media outlet</li>
            <li>✔ Networking opportunities with thought leaders and innovators</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default MediaShowCase;