import { motion } from "framer-motion";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <footer className="relative bg-[#E63D3E] text-white min-h-[500px] overflow-hidden text-center py-20">
      {/* Top White Triangle */}
      <div className="absolute top-0 left-0 w-full h-[200px] bg-white z-0 triangle-down" />

      {/* TEDx Logo */}
      <div className="relative z-10 mt-0 md:mt-[35px]">
        <h1 className="text-[#E63D3E] text-5xl font-extrabold">TED<span className="text-black">x</span></h1>
      </div>

      {/* Main content */}
      <motion.div
        className="container mx-auto px-6 relative z-10 mt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2
          variants={childVariants}
          className="text-2xl md:text-4xl font-bold mb-6"
        >
          Be part of our events!
        </motion.h2>

        <motion.div
          variants={childVariants}
          className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8"
        >
          {[
            { text: "Become a Partner", href: "/partner-form" },
            { text: "Nominate a Speaker", href: "/speaker-form" },
            { text: "Join as a Volunteer", href: "/volunteer-form" },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="bg-white text-[#E63D3E] font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition"
            >
              🔴 {item.text}
            </a>
          ))}
        </motion.div>

        <motion.div
          variants={childVariants}
          className="text-lg font-medium flex items-center justify-center gap-4 flex-wrap"
        >
          <span>Follow Us:</span>
          {[
            {
              name: "Instagram",
              href: "https://instagram.com/tedxalgeria",
              icon: <FaInstagram className="w-6 h-6 fill-white hover:fill-[#F97316] transition-colors duration-200" />,
            },
            {
              name: "LinkedIn",
              href: "https://linkedin.com/company/tedxalgeria",
              icon: <FaLinkedin className="w-6 h-6 fill-white hover:fill-[#F97316] transition-colors duration-200" />,
            },
            {
              name: "YouTube",
              href: "https://youtube.com/@tedxalgeria",
              icon: <FaYoutube className="w-6 h-6 fill-white hover:fill-[#F97316] transition-colors duration-200" />,
            },
          ].map((link, index) => (
            <a
              key={index}
              href={link.href}
              aria-label={`Follow us on ${link.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.icon}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom angled corners */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D33838] clip-bl" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#D33838] clip-br" />

      {/* Custom clip-paths */}
      <style>{`
        .triangle-down {
          clip-path: polygon(50% 100%, 0 0, 100% 0);
        }
        .clip-bl {
          clip-path: polygon(0 100%, 100% 100%, 0 0);
        }
        .clip-br {
          clip-path: polygon(100% 100%, 0 100%, 100% 0);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
