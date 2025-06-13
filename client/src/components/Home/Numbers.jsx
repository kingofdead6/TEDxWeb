import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { value: 700, text: ["People reached"], animated: true, suffix: "K+" },
  { value: 1000, text: ["Engaged Attendees"], animated: true },
  { value: 20, text: ["Strategic Partners"], animated: true },
  { value: 10, text: ["Events"], animated: true },
];

const AnimatedNumber = ({ target, suffix = "+" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const duration = 2000;
    const increment = Math.ceil(target / (duration / 50));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setCount(current);
    }, 50);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-600 whitespace-nowrap">
      {count.toLocaleString()}
      {suffix}
    </p>
  );
};

const Numbers = () => {
  return (
    <section className="relative bg-white py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-10 px-6 py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[#DE8F5A]">Quick Numbers</h2>
        </motion.div>

        {/* Stats Flexbox Container */}
        <div className="flex justify-center items-center gap-20 flex-wrap">
          {stats.map((item, index) => {
            const isSingleLine = item.text.length === 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                className={`flex ${isSingleLine ? "items-center" : "items-start"} justify-center text-left gap-4`}
              >
                {/* Number */}
                {item.animated ? (
                  <AnimatedNumber target={item.value} suffix={item.suffix || "+"} />
                ) : (
                  <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-red-600 whitespace-nowrap">
                    {item.value}
                  </p>
                )}
                {/* Text */}
                <div
                  className={`text-sm sm:text-md md:text-lg text-black font-medium leading-tight ${isSingleLine ? "" : "mt-4"}`}
                >
                  {item.text.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Numbers;
