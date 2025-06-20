import React from 'react';
import { motion } from 'framer-motion';
import BackgroundImage from '../../../assets/partners/mainBg.JPG'; 

const OurPartners = () => {

  return (
    <section className="relative h-screen overflow-visible mt-0 sm:mt-20">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Subtle dark overlay */}
      </div>
      <div className="absolute inset-0 backdrop-blur-xs" style={{ backgroundImage: "linear-gradient(to top, #EB0028C9 -50%, transparent 100%)" }} />

      {/* Content */}
      <div className="container mx-auto px-4 text-center h-full flex flex-col justify-center md:mt-14 relative z-20" >
        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-6xl sm:text-5xl md:text-[80px] font-extrabold mb-4 md:mb-6 mt-20 md:mt-0 leading-tight text-white"
        >
          <span>Empowering </span>
          <span
            style={{
              background: "linear-gradient(90deg, #F4D58D 26.01%, #DE8F5A 45.24%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Partnerships
          </span>
          <span className="text-white">, Driving </span>
          <span
            style={{
              background: "linear-gradient(90deg, #F4D58D 26.01%, #DE8F5A 45.24%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Impact
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-2xl sm:text-2xl md:text-[36px] font-light text-white/90 max-w-6xl mx-auto mb-6 md:mb-8 px-4"
        >
          Our success is built on collaboration. Our partners play a crucial role in making each event a reality, from funding to media coverage to logistics. We are proud to work with organizations that share our passion for spreading ideas that matter.
        </motion.p>
      </div>
    </section>
  );
};

export default OurPartners;