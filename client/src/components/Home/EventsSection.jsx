import { motion } from "framer-motion";
import EventImage from "/EventImage.jpg";
import BlackX from "/BlackX.png";
import RedX from "/RedX.png";
import { useState } from "react";

const EventsSection = () => {
  // Placeholder: Replace with actual logic to check for upcoming events
  const hasUpcomingEvent = true;

  // Placeholder: Handle email signup (e.g., connect to an API or service)
  const [email, setEmail] = useState("");
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    // Add your email signup logic here (e.g., API call)
    setEmail("");
  };

  // Animation variants for staggered entrance
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
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.4, 0, 0.2, 1] } },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
  };

  return (
    <section className="relative bg-white py-20 overflow-y-visible">
      <div className="absolute inset-0 min-w-6xl z-1 hidden md:block">
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: 55, opacity: 1 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 80, damping: 20 }}
          className="absolute -bottom-140 -left-55 w-1/2 h-full bg-no-repeat bg-left bg-contain"
          style={{ backgroundImage: `url(${BlackX})` }}
        ></motion.div>
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: -10, opacity: 1 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 80, damping: 20 }}
          className="absolute -top-20 right-5 w-lg h-full bg-no-repeat bg-right bg-contain"
          style={{ backgroundImage: `url(${RedX})` }}
        ></motion.div>
      </div>

      {/* Top "Join the Experience" Link */}
      <div className="justify-center bg-white text-center relative px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          className="inline-block mb-16 px-6 py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[#DE8F5A]">Join Our Next Event</h2>
        </motion.div>
      </div>

      <motion.div
        className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 w-full md:w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text and Button/Form */}
        <motion.div className="flex-1 text-left" variants={childVariants}>
          <motion.h2
            variants={childVariants}
            className="text-xl font-bold text-[#F4A261] mb-8 tracking-wide"
          >
            Attend Our Events
          </motion.h2>
          <motion.p
            variants={childVariants}
            className="text-2xl md:text-4xl font-medium text-gray-900 mb-8 leading-tight"
          >
            💡 Join us at our next event! Stay inspired, network with changemakers, and experience the power of ideas.
          </motion.p>

          {hasUpcomingEvent ? (
            <motion.a
              href="/events"
              variants={childVariants}
              initial={{
                boxShadow: "0px 8px 60px 8px rgba(239, 184, 122, 0.6)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 12px 70px 10px rgba(239, 120, 40, 0.65)",
                backgroundColor: "#F97316",
                color: "#FFFFFF",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], hover: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
              className="inline-block px-8 py-3 rounded-full bg-[#EFB87A] text-black font-bold text-lg sm:text-xl cursor-pointer"
              aria-label="View our events"
            >
              Explore Events
            </motion.a>
          ) : (
            <div className="max-w-md">
              <motion.p
                variants={childVariants}
                className="text-lg sm:text-xl font-medium text-black mb-4"
              >
                Sign up to be the first to know about our next experience.
              </motion.p>
              <motion.form
                onSubmit={handleEmailSubmit}
                variants={childVariants}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-full border border-[#DE8F5A] focus:outline-none focus:ring-2 focus:ring-[#EFB87A] text-black"
                  required
                />
                <button
                  type="submit"
                  className="cursor-pointer bg-[#EFB87A] text-black px-6 py-2 rounded-full font-bold text-lg hover:bg-[#F97316] transition-colors duration-200"
                >
                  Sign Up
                </button>
              </motion.form>
            </div>
          )}
        </motion.div>

        {/* Image Part */}
        <motion.div
          className="relative flex-1 max-w-sm mt-12 md:mt-0"
          variants={imageVariants}
          whileHover="hover"
        >
          <motion.img
            src={EventImage}
            alt="TEDxAlgeria event with attendees"
            className="rounded-lg h-full shadow-xl"
            whileHover={{ rotate: 1 }}
            transition={{ duration: 0.2 }}
          />
          {/* Yellow Square */}
          <motion.div
            className="absolute -top-10 -left-10 w-30 h-30 bg-[#F4E4A2] z-10 -translate-x-6 -translate-y-6"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Orange Square */}
          <motion.div
            className="absolute -bottom-30 -right-25 w-50 h-50 bg-[#F4A261] z-10 translate-x-6 translate-y-6"
            initial={{ rotate: 10 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Red Light */}
          <motion.div
            className="absolute -bottom-10 right-58 w-60 h-60 bg-[#E63D3E] opacity-20 -z-10 translate-x-6 translate-y-6 rounded-full"
            style={{ filter: "blur(15px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
          {/* Yellow Light */}
          <motion.div
            className="absolute -top-20 -right-10 w-60 h-60 bg-[#EFB871] opacity-20 -z-10 translate-x-6 translate-y-6 rounded-full"
            style={{ filter: "blur(15px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EventsSection;