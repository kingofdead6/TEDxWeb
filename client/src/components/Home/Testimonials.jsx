import { useRef } from 'react';
import { motion } from "framer-motion";

// Testimonial data with image URLs
const testimonials = [
  {
    id: 1,
    quote: "Honestly, I didn’t expect it to be this organized and impactful. It felt great seeing so many motivated young Algerians in one place.",
    name: "Yasmine Bensalem",
    role: "Attendee",
  },
  {
    id: 2,
    quote: "As a speaker, I was truly impressed by the professionalism of the team. Everything was on time and the audience was amazing.",
    name: "Sofiane Belkacem",
    role: "Speaker",
  },
  {
    id: 3,
    quote: "It was more than just an event — it was a gathering of ideas, ambition, and real community spirit. Proud to have been part of it.",
    name: "Houssem Djenadi",
    role: "Organizer",
  },
  {
    id: 4,
    quote: "I’ve attended similar events abroad, but this one in Algeria really surprised me. The vibe, the energy — it felt local and global at the same time.",
    name: "Sara Bouzid",
    role: "Attendee",
  }
];


const Testimonials = () => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden mt-0">
      {/* Title */}
      <div className="text-center relative px-4 mb-12 sm:mb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center gap-2"
        >
          <motion.h2
            variants={childVariants}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wide"
          >
            What They Say About Event
          </motion.h2>
        </motion.div>
      </div>

      {/* Testimonials Grid */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={childVariants}
              className="max-w-xl mx-auto"
            >
              <div className="bg-white rounded-lg p-4 sm:p-5 border border-gray-300 shadow-md shadow-red-500 hover:shadow-lg transition-shadow duration-300 hover:bg-red-500 group flex">
                {/* Quote Box */}
                <div className="mb-3 sm:mb-4 text-left">
                  <div className='text-left mb-4'>
                    <p className="text-black font-bold text-xl sm:text-2xl group-hover:text-white transition-colors duration-300">{testimonial.name}</p>
                    <p className="text-gray-600 text-md group-hover:text-white transition-colors duration-300">{testimonial.role}</p>
                  </div>
                  <p className="text-black font-semibold text-sm sm:text-base italic group-hover:text-white transition-colors duration-300">"{testimonial.quote}"</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;