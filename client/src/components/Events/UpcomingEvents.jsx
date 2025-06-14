import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import RedX from "/RedX.png";
import { FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import toast, { Toaster } from "react-hot-toast";
import EventModal from "./EventModal";

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date(); // Use current date

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Filter upcoming events (date >= today)
        let upcomingEvents = response.data.filter(
          (event) => new Date(event.date) >= today
        );
        // Sort events by closest date
        upcomingEvents = upcomingEvents.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setEvents(upcomingEvents);
        setLoading(false);
      } catch (err) {
        console.error("Fetch events error:", err);
        setError("Failed to load events. Please try again later.");
        toast.error("Failed to load upcoming events.", {
          style: {
            background: "#fff",
            color: "#1a1a1a",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          },
        });
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const openModal = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  // Check if registration is open
  const isRegistrationOpen = (event) => {
    return event.isRegistrationOpen === true;
  };

  return (
    <section className="relative bg-white py-20 overflow-hidden">
      <Toaster position="top-center" />
      {/* Custom Scrollbar Styles */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #e63d3d54 10%, #e63d3e 50%, #e63d3d54 90%);
            border-radius: 20px;
            min-height: 40px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #ffeef0;
            border-radius: 20px;
          }
        `}
      </style>

      <div className="absolute inset-0 min-w-6xl z-1">
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: -15, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
          className="absolute top-70 -left-35 w-1/3 h-full bg-no-repeat bg-left bg-contain md:block"
          style={{ backgroundImage: `url(${RedX})` }}
        />
      </div>

      <div className="justify-center bg-white text-center relative px-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-30 px-6 py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[#DE8F5A]">Upcoming Events</h2>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-20 flex flex-col md:flex-row">
        <div className="w-full px-4 mb-8 md:w-2xl md:pr-15 md:-mr-10 md:ml-10 md:mb-0">
          <motion.h2
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
            className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-black mb-6 leading-tight"
          >
            Discover what’s next on the journey
          </motion.h2>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50, damping: 10 }}
            className="text-base sm:text-lg md:text-xl font-medium text-black max-w-full md:max-w-lg"
          >
            Discover the next experiences. New ideas, powerful voices, and inspiring moments are on the way. Don’t miss what’s coming next.
          </motion.p>
        </div>

        {/* Right Side: Scrollable Events */}
        <div className="md:w-[45%] overflow-y-auto max-h-[100vh] p-4 rounded-xl custom-scrollbar" dir="rtl">
          <div dir="ltr">
            {loading ? (
              <p className="text-center text-gray-600">Loading events...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : events.length === 0 ? (
              <p className="text-center text-gray-600">No upcoming events found.</p>
            ) : (
              events.map((event, index) => (
                <motion.div
                  key={`${event.id}-${index}`}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 50, damping: 10 }}
                  className="mb-30"
                >
                  <h3 className="text-4xl font-extrabold text-black mb-4">
                    <span className="text-[#EB0028] text-5xl">X{index + 1}</span> {event.title}
                  </h3>
                  <div
                    onClick={() => openModal(event)}
                    className="block relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
                  >
                    <img
                      src={event.picture || "/placeholder.jpg"}
                      alt={event.title}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="relative z-10 text-white p-4 flex flex-col space-y-2">
                        <div className="-mb-5">
                          <p className="text-md font-bold text-center ml-15">
                            {new Date(event.date).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xl flex items-center font-extrabold gap-1 max-w-[400px]">
                            <FaMapMarkerAlt className="w-8 h-8" /> {event.location}
                          </p>
                        </div>
                        <motion.span
                          className="text-sm font-semibold text-right cursor-pointer"
                          whileHover={{ x: 5, opacity: 0.8 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          View details →
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  {isRegistrationOpen(event) && (
                    <Link to={`/events/${event.id}/register`}>
                      <motion.button
                        className="cursor-pointer mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Register Now
                      </motion.button>
                    </Link>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reusable Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={closeModal}
      />
    </section>
  );
};

export default UpcomingEvents;