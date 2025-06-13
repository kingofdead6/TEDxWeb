import React from 'react';
import { motion } from "framer-motion";
import { FaStar, FaBrain, FaShieldAlt, FaUsers, FaSearch } from 'react-icons/fa';
import RedX from "/RedX.png";

const sections = [
  {
    title: "We uphold the highest standards in content and organization.",
    icon: FaStar,
    baseBg: "bg-white",
    hoverBg: "bg-[#EB0028]",
    baseText: "text-black",
    hoverText: "text-white",
    baseIconColor: "text-[#EB0028]",
    hoverIconColor: "text-white",
  },
  {
    title: "We welcome perspectives from various fields and backgrounds.",
    icon: FaBrain,
    baseBg: "bg-white",
    hoverBg: "bg-[#EB0028]",
    baseText: "text-black",
    hoverText: "text-white",
    baseIconColor: "text-[#EB0028]",
    hoverIconColor: "text-white",
  },
  {
    title: "Our events are driven by authenticity and credibility.",
    icon: FaShieldAlt,
    baseBg: "bg-white",
    hoverBg: "bg-[#EB0028]",
    baseText: "text-black",
    hoverText: "text-white",
    baseIconColor: "text-[#EB0028]",
    hoverIconColor: "text-white",
  },
  {
    title: "We believe in working together to create impactful experiences.",
    icon: FaUsers,
    baseBg: "bg-white",
    hoverBg: "bg-[#EB0028]",
    baseText: "text-black",
    hoverText: "text-white",
    baseIconColor: "text-[#EB0028]",
    hoverIconColor: "text-white",
  },
  {
    title: "A commitment to continuous learning and discovery.",
    icon: FaSearch,
    baseBg: "bg-white",
    hoverBg: "bg-[#EB0028]",
    baseText: "text-black",
    hoverText: "text-white",
    baseIconColor: "text-[#EB0028]",
    hoverIconColor: "text-white",
  },
];

const OurValues = () => {
  return (
    <section className="relative py-16 px-4">
      <div className="absolute inset-0 min-w-6xl z-0">
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: -20, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
          className="absolute top-120 right-20 w-1/4 h-full bg-no-repeat bg-left bg-contain md:block"
          style={{ backgroundImage: `url(${RedX})` }}
        ></motion.div>
      </div>
      <div className="container mx-auto px-4 text-center mt-10">
        <div className="justify-center bg-white text-center relative px-4" dir="rtl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-16 px-6 py-2 rounded-full bg-[#D9D9D9] shadow-sm"
          >
            <h2 className="text-xl font-semibold text-[#DE8F5A]">Get to know us</h2>
          </motion.div>
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold mb-16">Our Values</h2>
        <div className="container mx-auto flex flex-col md:flex-row gap-6 justify-center items-stretch flex-wrap">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className={`group max-w-sm md:w-lg p-8 ${section.baseBg} rounded-lg shadow-md flex flex-col items-center text-center transition-all duration-300 z-20`}
              whileHover={{ 
                backgroundColor: '#EB0028',
                color: section.hoverText,
                scale: 1.02,
                boxShadow: "0 12px 30px rgba(235, 0, 40, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <section.icon 
                  className={`w-12 h-12 transition-all duration-300 ${section.baseIconColor} group-hover:${section.hoverIconColor}`}
                />
              </div>
              <p className={`text-xl md:text-2xl font-medium max-w-md ${section.baseText} group-hover:${section.hoverText}`}>
                {section.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;