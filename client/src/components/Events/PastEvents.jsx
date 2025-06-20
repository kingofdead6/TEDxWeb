import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import toast, { Toaster } from "react-hot-toast";
import EventModal from "./EventModal";

const PastEvents = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const pastEvents = response.data.filter(
          (event) => new Date(event.date) < today
        );
        setEvents(pastEvents);
        setLoading(false);
      } catch (err) {
        console.error("Fetch events error:", err);
        setError("Failed to load events. Please try again later.");
        toast.error("Failed to load past events.", {
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

  return (
    <section className="relative bg-white py-12 sm:py-16 md:py-20 overflow-hidden">
      <Toaster position="top-center" />
      <div className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-center mb-12 sm:mb-16 md:mb-20">
        <h1>Past Events</h1>
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-20">
        {loading ? (
          <p className="text-center text-gray-600 text-base sm:text-lg">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-600 text-base sm:text-lg">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 text-base sm:text-lg">No past events found.</p>
        ) : (
          <div className="flex flex-col gap-8 sm:gap-12">
            {events.map((event, index) => (
              <motion.div
                key={`${event.id}-${index}`}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 50, damping: 10 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white rounded-lg shadow-md hover:shadow-lg shadow-red-500 transition-shadow duration-300"
              >
                {/* Event Image */}
                <div className="w-full sm:w-1/2">
                  <div
                    onClick={() => openModal(event)}
                    className="block relative overflow-hidden rounded-lg cursor-pointer touch-action-manipulation"
                    role="button"
                    aria-label={`View details for ${event.title}`}
                  >
                    <img
                      src={event.picture || "/placeholder.jpg"}
                      srcSet={`${event.picture || "/placeholder.jpg"} 1x, ${
                        event.picture || "/placeholder.jpg"
                      } 2x`}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 50vw"
                      alt={event.title}
                      className="w-full h-64 sm:h-56 md:h-[400px] object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black to-transparent opacity-70 hover:opacity-90 transition-opacity duration-500 flex flex-col justify-end">
                      <div className="relative z-10 text-white p-3 sm:p-4">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white max-w-xs sm:max-w-sm">
                          "{event.theme || "Inspiring Ideas"}"
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="w-full sm:w-1/2 p-4 sm:p-6 flex flex-col justify-between">
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black">{event.title}</h2>
                    <p className="text-sm sm:text-base md:text-lg font-medium text-black max-w-full sm:max-w-lg">
                      {event.description || "No description available."}
                    </p>
                    <div className="flex flex-col space-y-1 sm:space-y-2">
                      <p className="text-sm sm:text-md font-bold flex items-center gap-1">
                        <FaCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#EB0028] mr-2" />
                        {new Date(event.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm sm:text-md font-bold flex items-center gap-1">
                        <FaMapMarkerAlt className="w-4 h-4 sm:w-5 sm:h-5 text-[#EB0028] mr-2" />
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
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

export default PastEvents;