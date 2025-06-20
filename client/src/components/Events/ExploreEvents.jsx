import { motion } from 'framer-motion';
import BackgroundImage from '../../assets/events.JPG'; // Adjust path to your background image

const Events = () => {
  return (
    <section className="relative h-screen overflow-visible mt-0 sm:mt-20 mb-10">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BackgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Subtle dark overlay */}
      </div>
      <div className="absolute inset-0 backdrop-blur-xs" style={{ backgroundImage: "linear-gradient(to top, #EB0028C9 -50%, transparent 100%)" }} />

      {/* Content */}
      <div className="container mx-auto px-4 text-center h-full flex flex-col justify-center md:mt-14 relative z-20">
        {/* Heading */}
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-6xl sm:text-5xl md:text-[80px] font-extrabold mb-4 md:mb-6 mt-30 md:mt-0 leading-tight text-white"
        >
          <span>Our </span>
          <span
            style={{
              background: "linear-gradient(90deg, #F4D58D 26.01%, #DE8F5A 45.24%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Events
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-2xl sm:text-2xl md:text-[36px] font-light text-white/90 max-w-6xl mx-auto mb-6 md:mb-8 px-4"
        >
          We are a hub for groundbreaking ideas, innovation, and thought-provoking discussions. Explore our past events that have left a mark and stay updated on upcoming editions that continue to push the boundaries of knowledge and creativity.
        </motion.p>
      </div>
    </section>
  );
};

export default Events;