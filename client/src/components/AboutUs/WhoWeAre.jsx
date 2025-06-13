import React from 'react'
import { motion } from "framer-motion";
import BlackX from "/BlackX.png";

const WhoWeAre = () => {
    return (
        <section className="mt-20 relative bg-white py-32 md:py-20 overflow-y-visible">
          {/* Dotted Pattern Background */}
        <div className="absolute inset-0 min-w-6xl z-1">
           <motion.div
             initial={{ rotate: 45, opacity: 0 }}
             animate={{ rotate: 20, opacity: 1 }}
             transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
             className="absolute -bottom-80 -left-50 w-1/4 h-full bg-no-repeat bg-left bg-contain md:block"
             style={{ backgroundImage: `url(${BlackX})` }}
           ></motion.div>
        </div>
    
          {/* Content */}
          <div className="container mx-auto px-4 text-center ">
            {/* Heading */}
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
              className="text-7xl sm:text-8xl md:text-8xl font-extrabold text-black mb-6"
            >
                Who We Are
            </motion.h1>
    
            {/* Description */}
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50, damping: 10 }}
              className="text-2xl sm:text-4xl md:text-4xl font-normal text-black max-w-7xl mx-auto"
            >
                This is a platform dedicated to sharing impactful ideas, fostering intellectual discussions, and bringing together inspiring voices from various fields. We organize independently curated events that highlight innovation, creativity, and knowledge sharing like University events, graduation events, TEDx Events and more.              
            </motion.p>
          </div>
        </section>
      );
}

export default WhoWeAre