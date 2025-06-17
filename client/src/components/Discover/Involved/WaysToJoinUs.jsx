import { motion, useAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const WaysToJoinUs = () => {
  const navigate = useNavigate();
  const [activeBox, setActiveBox] = useState(null);
  const boxesRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleBoxClick = (index) => {
    setActiveBox(activeBox === index ? null : index);
  };

  const boxVariants = {
    default: { scale: 1 },
    active: { scale: 1.2 },
    inactive: { scale: 0.8 },
  };

  const joinOptions = [
    {
      title: "Join as a Volunteer",
      description: "Support event operations, speaker coordination, and logistics.",
      href: "/volunteer-form",
      image: "/Volunteer.jpg",
    },
    {
      title: "Join as Media/Press",
      description: "Cover our event, interview speakers, and share their ideas.",
      href: "/media-form",
      image: "/MediaPress.jpg",
    },
    {
      title: "Join as a Performer",
      description: "Showcase your talent and be part of the experience.",
      href: "/performer-form",
      image: "/Preformer.jpg",
    },
  ];

  // Handle click outside to reset box sizes
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxesRef.current && !boxesRef.current.contains(event.target)) {
        setActiveBox(null);
      }
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="bg-white py-20 text-center">
      <div className="container mx-auto px-6">
        {/* Title */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-20"
        >
          Ways to Join Us
        </motion.h1>

        {/* Join Boxes */}
        <div ref={boxesRef} className="flex flex-col md:flex-row justify-center gap-6 mb-12">
          {joinOptions.map((option, index) => (
            <motion.div
              key={index}
              className="relative w-[360px] h-[500px] cursor-pointer rounded-xl overflow-hidden"
              onClick={() => !isMobile && handleBoxClick(index)}
              animate={
                activeBox === index
                  ? "active"
                  : activeBox !== null && activeBox !== index
                  ? "inactive"
                  : "default"
              }
              variants={boxVariants}
              transition={{ duration: 0.5, type: "spring", stiffness: 50, damping: 10 }}
            >
              {/* Background Image Layer */}
              <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
                  activeBox === index ? "blur-sm scale-105" : ""
                }`}
                style={{
                  backgroundImage: `url(${option.image})`,
                }}
              ></div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#EB0028C9] to-transparent z-10" />

              {/* Content Layer */}
              <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
                <motion.h2
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50, damping: 10 }}
                  className="text-2xl sm:text-3xl md:text-3xl font-bold text-white"
                >
                  {option.title}
                </motion.h2>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 50, damping: 10 }}
                  className="text-xl md:text-2xl font-medium text-white mb-6"
                >
                  {option.description}
                </motion.p>
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 50, damping: 10 }}
                  className="px-10 py-2 bg-[#00000000] text-white border-yellow-600 border-2 text-2xl cursor-pointer rounded-full font-semibold hover:bg-[#EFB87A] hover:text-black transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(option.href);
                  }}
                >
                  Apply
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, type: "spring", stiffness: 50, damping: 10 }}
          className="text-lg md:text-xl font-medium text-gray-900 mt-20"
        >
          <p className="mb-2"> Have a unique way to contribute? Get in touch!</p>
          <a
            href="mailto:contact@tedxuoalgiers.com "
            className="text-[#DE8F5A] hover:text-[#F97316] transition-colors duration-200"
            aria-label="Email contact at TEDx University of Algiers"
          >
            🔴 contact@tedxuoalgiers.com 
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default WaysToJoinUs;