import { motion } from "framer-motion";
import EventImage from "/EventImage.jpg"; // Adjust path to your image
import BackgroundImage from "../../assets/carousel/image1.jpg"; // Background image for section

const EventsSection = () => {
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
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
    hover: { scale: 1.03, rotate: 0.5, transition: { duration: 0.3 } },
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* Overlay for readability */}
      </div>

      <motion.div
        className="container mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-12 max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Text and Button */}
        <motion.div className="flex-1 text-left md:max-w-lg" variants={childVariants}>
          <motion.h2
            variants={childVariants}
            className="text-lg sm:text-xl font-semibold text-[#F4A261] mb-4 sm:mb-6 tracking-wider uppercase"
          >
            Attend Our Events
          </motion.h2>
          <motion.p
            variants={childVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight mb-6 sm:mb-8"
          >
            ✨ Join us to spark inspiration, connect with visionaries, and ignite ideas that change the world.
          </motion.p>
          <motion.a
            href="/events"
            variants={childVariants}
            initial={{
              boxShadow: "0px 8px 30px rgba(239, 184, 122, 0.5)",
              background: "linear-gradient(90deg, #EFB87A, #F97316)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 12px 40px rgba(239, 120, 40, 0.7)",
              background: "linear-gradient(90deg, #F97316, #E63D3E)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="inline-block px-6 py-2 sm:px-8 sm:py-3 rounded-full text-white font-semibold text-base sm:text-lg cursor-pointer"
            aria-label="View our events"
          >
            Explore Events
          </motion.a>
        </motion.div>

        {/* Image Part */}
        <motion.div
          className="flex-1 max-w-xs sm:max-w-sm md:max-w-lg mr-0 md:-mr-22 mt-8 md:mt-0"
          variants={imageVariants}
          whileHover="hover"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-sm p-2 sm:p-3">
            <img
              src={EventImage}
              alt="TEDxAlgeria event with attendees"
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
            />
            {/* Subtle Decorative Element */}
            <motion.div
              className="absolute -top-4 -left-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#F4A261]/30 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            />
            <motion.div
              className="absolute -bottom-4 -right-4 w-12 h-12 sm:w-16 sm:h-16 bg-[#E63D3E]/30 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EventsSection;