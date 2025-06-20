import React from 'react';
import { motion } from "framer-motion";
import { FaBullseye, FaEye } from 'react-icons/fa';
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
       <div className="container mx-auto px-4 text-center mt-10">
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