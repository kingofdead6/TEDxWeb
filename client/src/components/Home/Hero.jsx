import { motion } from "framer-motion";
import backgroundImage from "../../assets/home/HeroImafe.JPG"; // Adjust path to your image

const Hero = () => {
  const handleScroll = () => {
    window.scrollBy({ top: 850, behavior: "smooth" });
  };

  return (
    <section className="relative h-screen md:py-32 lg:py-60 overflow-visible mb-2">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`, // Use imported image
        }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Subtle dark overlay */}
      </div>
      <div className="absolute inset-0" style={{backgroundImage:"linear-gradient(to top, #EB0028C9 -50%, transparent 100%)"}} />

      {/* Content */}
      <div className="container mx-auto px-4 text-center h-full flex flex-col justify-center md:mt-14 relative z-20" dir="rtl">

        {/* Slogan */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-6xl sm:text-5xl md:text-[80px] font-extrabold mb-4 md:mb-6 leading-tight text-white"
        >
          <span>Igniting </span>
          <span
            style={{
              background: "linear-gradient(90deg, #F4D58D 26.01%, #DE8F5A 45.24%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ideas
          </span>
          <span className="text-white">, Inspiring </span>
          <span
            style={{
              background: "linear-gradient(90deg, #F4D58D 26.01%, #DE8F5A 45.24%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Change
          </span>
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-2xl sm:text-2xl md:text-[36px] font-light text-white/90 max-w-4xl mx-auto mb-6 md:mb-8 px-4"
        >
          Events that bring together Algeria’s brightest minds to share powerful ideas
        </motion.p>

        {/* Learn More Button */}
        <motion.a
          onClick={handleScroll}
          className="inline-block bg-[#EFB87A] text-black px-4 py-2 sm:px-6 sm:py-2 md:px-6 md:py-3 rounded-full font-bold text-base sm:text-lg md:text-xl cursor-pointer transition-colors duration-200 mx-auto"
          initial={{ y: 50, opacity: 0, boxShadow: "0px 8px 60px 8px rgba(239, 184, 122, 0.6)" }}
          animate={{ y: 0, opacity: 1, boxShadow: "0px 8px 60px 8px rgba(239, 184, 122, 0.6)" }}
          whileHover={{
            boxShadow: "0px 12px 70px 10px rgba(239, 120, 40, 0.65)",
            backgroundColor: "#F97316",
            scale: 1.05,
          }}
          transition={{ duration: 0.5, delay: 0, ease: [0.4, 0, 0.2, 1], hover: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
        >
          Learn More
        </motion.a>
      </div>

    </section>
  );
};

export default Hero;