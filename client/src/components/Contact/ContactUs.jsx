import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import BlackX from "/BlackX.png";

const ContactUs = () => {
    return (
        <section className="mt-0 sm:mt-20 relative bg-white py-32 md:py-20 overflow-y-visible">
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
        <div className="justify-center bg-white text-center relative px-4 mb-10" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-16 px-6 py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[#DE8F5A]">Talk with us</h2>
        </motion.div>
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
                Contact Us
            </motion.h1>
    
            {/* Description */}
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50, damping: 10 }}
              className="text-2xl sm:text-4xl md:text-4xl font-normal text-black max-w-7xl mx-auto"
            >
                 We’d love to hear from you! Whether you have questions, suggestions, or partnership inquiries, our team is here to assist you. Please fill out the form below, and we’ll get back to you as soon as possible.              
            </motion.p>
          </div>
        </section>
      );
}

export default ContactUs