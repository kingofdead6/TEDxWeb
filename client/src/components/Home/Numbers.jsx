import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import backgroundImage from "../../assets/home/NumbersBg.JPG";

const stats = [
  { value: 700, text: ["People Reached"], animated: true, suffix: "K+" },
  { value: 1000, text: ["Engaged Attendees"], animated: true, suffix: "+" },
  { value: 20, text: ["Strategic Partners"], animated: true, suffix: "+" },
  { value: 10, text: ["Events"], animated: true, suffix: "+" },
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
    <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-500 whitespace-nowrap">
      {count.toLocaleString()}
      {suffix}
    </p>
  );
};

const Numbers = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
             {/* Background Image with Overlay */}
        <div
         className={`
           absolute inset-0 bg-no-repeat rounded-4xl
           bg-[length:130%] bg-[position:0px_0px]
           sm:bg-[length:100%] sm:bg-[position:0px_-400px]
         `}
         style={{
           backgroundImage: `url(${backgroundImage})`,
         }}
       >
         <div className="absolute inset-0 bg-black/10 rounded-4xl" />
       </div>


      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Stats Flexbox Container */}
        <div className="flex justify-center items-center gap-6 sm:gap-10 md:gap-12 flex-wrap">
          {stats.map((item, index) => {
            const isSingleLine = item.text.length === 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className={`flex ${isSingleLine ? "items-center" : "items-start"} justify-center text-left gap-3 w-[45%] sm:w-[30%] md:w-[22%] min-w-[140px] p-4 rounded-lg bg-white/10 backdrop-blur-sm`}
              >
                {/* Number */}
                {item.animated ? (
                  <AnimatedNumber target={item.value} suffix={item.suffix || "+"} />
                ) : (
                  <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-orange-500 whitespace-nowrap">
                    {item.value}
                  </p>
                )}
                {/* Text */}
                <div
                  className={`text-sm sm:text-lg md:text-xl text-white font-semibold leading-tight ${isSingleLine ? "" : "mt-2"}`}
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