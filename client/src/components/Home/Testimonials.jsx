import{ useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from "framer-motion";

// Testimonial data with image URLs
const testimonials = [
  {
    id: 1,
    quote: "TEDxAlgeria was a game-changer! I left with new ideas and powerful connections.",
    name: "Azzedine",
    role: "Speaker",
    image: "/RedX.png",
  },
  {
    id: 2,
    quote: "An incredible experience that sparked creativity and collaboration.",
    name: "Fatima",
    role: "Attendee",
    image: "/RedX.png",
  },
  {
    id: 3,
    quote: "The energy and inspiration at TEDxAlgeria were unmatched!",
    name: "Omar",
    role: "Organizer",
    image: "/RedX.png",
  },
  {
    id: 4,
    quote: "A truly remarkable event! It broadened my horizons.",
    name: "Ahmed",
    role: "Speaker",
    image: "/RedX.png",
  },
  {
    id: 5,
    quote: "I made valuable connections that continue to impact my career.",
    name: "Laila",
    role: "Attendee",
    image: "/RedX.png",
  },
  {
    id: 6,
    quote: "I was so inspired by the incredible talks at TEDxAlgeria!",
    name: "Mouad",
    role: "Organizer",
    image: "/RedX.png",
  },
  {
    id: 7,
    quote: "A life-changing experience that left me wanting more.",
    name: "Zineb",
    role: "Speaker",
    image: "/RedX.png",
  },
  {
    id: 8,
    quote: "The ideas shared were nothing short of groundbreaking.",
    name: "Sami",
    role: "Attendee",
    image: "/RedX.png",
  },
  {
    id: 9,
    quote: "I gained new perspectives that I continue to apply in my work.",
    name: "Rania",
    role: "Organizer",
    image: "/RedX.png",
  },
  {
    id: 10,
    quote: "I was so inspired by the passion and innovation at TEDxAlgeria!",
    name: "Mohamed",
    role: "Speaker",
    image: "/RedX.png",
  },
];

const Testimonials = () => {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleMouseEnter = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPause();
    }
  };

  const handleMouseLeave = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  };

  return (
    <section className="relative bg-white py-20 overflow-hidden mt-20">
      {/* Title */}
      <div className="text-center relative px-4 mb-16">
        <motion.div
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
          }}
          initial="hidden"
          animate="visible"
          className="inline-block px-6 py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[#DE8F5A]">What People Say - Testimonials</h2>
        </motion.div>
      </div>

      {/* Testimonials Carousel with Fade Effect */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative max-w-6xl mx-auto"
      >
        {/* Fade Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <Slider ref={sliderRef} {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-4 lg:px-6">
              <div className="mx-auto flex flex-col justify-between max-w-sm min-h-[50px]">
                {/* Quote Box */}
                <div className="bg-white rounded-lg p-4 mb-2 border-1 border-[#1F1F1F] h-[130px] flex justify-center items-center text-center">
                  <p className="text-black font-medium text-lg italic">"{testimonial.quote}"</p>
                </div>
                {/* Writer Box */}
                <div className="bg-white rounded-lg p-4 mb-2 border-1 border-[#1F1F1F] flex text-left">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mx-6 object-cover"
                  />
                  <div className="text-left">
                    <p className="font-semibold text-black text-lg">{testimonial.name}</p>
                    <p className="text-md text-[#1F1F1F]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;