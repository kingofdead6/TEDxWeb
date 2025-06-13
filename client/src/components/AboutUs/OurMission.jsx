import React from 'react';
import { motion } from "framer-motion";
import { FaBullseye, FaEye } from 'react-icons/fa';
import BlackX from "/BlackX.png";
const sections = [
  {
    title: "OUR MISSION",
    description: "We strive to create events that spark meaningful conversations and inspire change. Through engaging talks, thought-provoking discussions, and dynamic performances, TEDxAlgeria aims to empower individuals and communities with ideas that shape the future.",
    icon: FaBullseye,
  },
  {
    title: "OUR VISION",
    description: "To be a driving force in spreading knowledge, encouraging dialogue, and promoting forward-thinking perspectives across different domains.",
    icon: FaEye,
  },
];

const OurMission = () => {
  return (
    <section className="relative py-16 px-4">
        <div className="absolute inset-0 min-w-6xl z-1">
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: 20, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
          className="absolute -bottom-80 right-20 w-1/4 h-full bg-no-repeat bg-left bg-contain md:block"
          style={{ backgroundImage: `url(${BlackX})` }}
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
      <div className="container mx-auto flex flex-col md:flex-row gap-6 justify-center items-stretch ">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className="group max-w-lg md:w-1/2 p-8 bg-white rounded-lg shadow-md flex flex-col items-center text-center transition-all duration-300 z-20"
            whileHover={{ 
              backgroundColor: "#EB0028",
              color: "#FFFFFF",
              scale: 1.02,
              boxShadow: "0 12px 30px rgba(235, 0, 40, 0.3)"
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4">
              <section.icon 
                className="w-12 h-12 text-[#EB0028] transition-all duration-300 group-hover:text-white" 
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4"> {section.title}</h2>
            <p className="text-xl md:text-2xl font-medium max-w-md">
              {section.description}
            </p>
          </motion.div>
        ))}
      </div>
      </div>

    </section>
  );
};

export default OurMission;