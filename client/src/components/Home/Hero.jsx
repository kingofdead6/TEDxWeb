import { motion } from "framer-motion";
import BlackX from "/BlackX.png";
import RedX from "/RedX.png";

const Hero = () => {
  const handleScroll = () => {
    window.scrollBy({ top: 1000, behavior: "smooth" });
  };

  return (
    <section className="relative bg-white py-32 md:py-60 overflow-visible">
      {/* Background Images */}
      <div className="absolute inset-0 min-w-6xl z-1">
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: -15, opacity: 1 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 80, damping: 20 }}
          className="absolute -top-5 -left-85 w-1/2 h-full bg-no-repeat bg-left bg-contain hidden md:block"
          style={{ backgroundImage: `url(${BlackX})` }}
        ></motion.div>
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: 55, opacity: 1 }}
          transition={{ duration: 1.2, type: "spring", stiffness: 80, damping: 20 }}
          className="absolute -bottom-70 -right-70 w-1/2 h-full bg-no-repeat bg-right bg-contain hidden md:block"
          style={{ backgroundImage: `url(${RedX})` }}
        ></motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 text-center mt-8 relative z-20" dir="rtl">
        {/* Slogan */}
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="text-3xl sm:text-5xl md:text-[80px] font-extrabold mb-6 leading-tight"
        >
          <span className="text-black">Igniting </span>
          <span
            style={{
              background: "linear-gradient(90deg, #F4D58D 26.01%, #DE8F5A 45.24%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Ideas
          </span>
          <span className="text-black">, Inspiring </span>
          <span
            style={{
              background: "linear-gradient(90deg, #E63D3E 26.01%, #B6001F 45.24%)",
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
          className="text-lg sm:text-2xl md:text-[36px] font-light text-black max-w-4xl mx-auto mb-8 px-4"
        >
          Events that bring together Algeria’s brightest minds to share powerful ideas
        </motion.p>

        {/* Learn More Button */}
        <motion.a
          onClick={handleScroll}
          className="inline-block bg-[#EFB87A] text-black px-6 py-2 sm:px-8 sm:py-3 rounded-full font-bold text-lg sm:text-xl cursor-pointer"
          initial={{ y: 50, opacity: 0, boxShadow: "0px 8px 60px 8px rgba(239, 184, 122, 0.6)" }}
          animate={{ y: 0, opacity: 1, boxShadow: "0px 8px 60px 8px rgba(239, 184, 122, 0.6)" }}
          whileHover={{
            boxShadow: "0px 12px 70px 10px rgba(239, 120, 40, 0.65)",
            backgroundColor: "#F97316",
            scale: 1.05,
          }}
          transition={{ duration: 0.5, delay: 0, ease: [0.4, 0, 0.2, 1], when: "beforeChildren", hover: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
        >
          Learn More
        </motion.a>
      </div>
    </section>
  );
};

export default Hero;