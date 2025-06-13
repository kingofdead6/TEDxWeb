import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlayCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrows for the carousel
const NextArrow = ({ onClick }) => (
  <motion.button
    className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 px-4 rounded-full shadow-lg hover:bg-red-700 z-10"
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    aria-label="Next image"
  >
    →
  </motion.button>
);

const PrevArrow = ({ onClick }) => (
  <motion.button
    className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white p-3 px-4 rounded-full shadow-lg hover:bg-red-700 z-10"
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    aria-label="Previous image"
  >
    ←
  </motion.button>
);

const EventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen || !event) return null;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-red-900 to-black/80 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white/10 backdrop-blur-lg rounded-xl w-full h-full p-8 md:p-12 overflow-y-auto shadow-2xl border border-white/20 no-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <style>
            {`
              .custom-dots li button:before {
                color: #fff;
                font-size: 12px;
                opacity: 0.5;
              }
              .custom-dots li.slick-active button:before {
                color: #ef4444;
                opacity: 1;
              }
              .font-inter {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              .no-scrollbar {
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE and Edge */
              }
              .no-scrollbar::-webkit-scrollbar {
                display: none; /* Chrome, Safari, and other WebKit browsers */
              }
            `}
          </style>
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-red-500 cursor-pointer transform duration-300"
            aria-label="Close modal"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes className="w-8 h-8" />
          </motion.button>

          <div className="font-inter text-white">
            <div className="relative mb-12">
              <img
                src={event.picture}
                alt={event.title}
                className="w-full h-[80vh] object-cover rounded-4xl shadow-lg"
              />
              <div
                className="rounded-4xl absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, #EB0028C9 10%, transparent 100%)'
                }}
              ></div>
              <h3 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-extrabold text-white drop-shadow-lg shadow-2xl">
                {event.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-xl">
                  <strong className="text-3xl font-semibold">Date:</strong>{" "}
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
                <p className="text-xl">
                  <strong className="text-3xl font-semibold">Location:</strong> {event.location}
                </p>
                <p className="text-xl">
                  <strong className="text-3xl font-semibold">Theme:</strong> {event.theme}
                </p>
                <p className="text-xl">
                  <strong className="text-3xl font-semibold">Description:</strong>{" "}
                  {event.description || "No description available."}
                </p>
                <p className="text-xl">
                  <strong className="text-3xl font-semibold">Speakers:</strong>{" "}
                  {event.speakers?.map((s) => s.fullName).join(", ") || "None"}
                </p>
                <p className="text-xl">
                  <strong className="text-3xl font-semibold">Partners:</strong>{" "}
                  {event.partners?.map((p) => p.organizationName).join(", ") || "None"}
                </p>
                {event.watchTalks && (
                  <p className="text-xl">
                    <strong className="text-3xl font-semibold">Watch Talks:</strong>{" "}
                    <motion.a
                      href={event.watchTalks}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-5 inline-block text-red-400 hover:text-red-300"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label="Watch talks"
                    >
                      <FaPlayCircle className="inline-block w-10 h-10" />
                    </motion.a>
                  </p>
                )}
                <p className="text-xl">
                  <strong className="text-3xl font-semibold">Seats Available:</strong> {event.seats || "N/A"}
                </p>
                <Link to={`/events/${event.id}/register`}>
                  <motion.button
                    className="cursor-pointer mt-8 px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 text-xl font-semibold shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Register for event"
                  >
                    Register Now
                  </motion.button>
                </Link>
              </div>
              <div>
                {event.gallery && event.gallery.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {event.gallery.map((image, index) => (
                      <motion.div
                        key={index}
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <img
                          src={image}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-[50vh] object-cover rounded-xl shadow-lg"
                        />
                      </motion.div>
                    ))}
                  </Slider>
                ) : (
                  <p className="text-xl text-white/70">No gallery images available.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventModal;