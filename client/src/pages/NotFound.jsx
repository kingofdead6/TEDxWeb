import React from 'react';
import { motion } from "framer-motion";

const NotFound = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center bg-white py-8 sm:py-20 overflow-y-visible">
            {/* Oops! Badge */}
            <div className="text-center relative px-4 mb-6 sm:mb-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-block mb-8 sm:mb-12 px-4 sm:px-6 py-1 sm:py-2 rounded-full bg-[#D9D9D9] shadow-sm"
                >
                    <h2 className="text-lg sm:text-xl font-semibold text-[#DE8F5A]">Oops!</h2>
                </motion.div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 text-center">
                <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
                    className="text-6xl sm:text-8xl md:text-9xl font-extrabold text-black mb-4"
                >
                    404
                </motion.h1>

                {/* Page Not Found */}
                <motion.h2
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 50, damping: 10 }}
                    className="text-2xl sm:text-2xl md:text-4xl font-bold text-black mb-4"
                >
                    Page Not Found
                </motion.h2>

                {/* Description */}
                <motion.p
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50, damping: 10 }}
                    className="text-lg font-light sm:text-4xl text-black mb-8 max-w-md mx-auto"
                >
                    Looks like you're lost.
                </motion.p>

                {/* Home Button */}
                <motion.a
                  href="/"
                  initial={{
                    boxShadow: "0 12px 30px rgba(244, 162, 97, 0.5)",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 24px 40px rgba(244, 162, 97, 0.5)",
                    backgroundColor: "#F4A261",
                    color: "white",
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-full bg-white text-black border-2 border-[#F4A261] font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:ring-offset-2 cursor-pointer"
                  aria-label="View our events"
                >
                 Go Home
                </motion.a>
            </div>
        </section>
    );
}

export default NotFound;