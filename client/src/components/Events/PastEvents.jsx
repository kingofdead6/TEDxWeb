import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import BlackX from "/BlackX.png";
import axios from "axios";
import { API_BASE_URL } from "../../../api";
import toast, { Toaster } from "react-hot-toast";
import EventModal from "./EventModal";

const PastEvents = () => {
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
        // Filter past events (date < today)
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
    <section className="relative bg-white py-20 overflow-hidden">
      <Toaster position="top-center" />
      <div className="absolute inset-0 z-1 hidden md:block">
        <motion.div
          initial={{ rotate: 45, opacity: 0 }}
          animate={{ rotate: 25, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 10 }}
          className="absolute top-50 left-75 w-1/3 h-full bg-no-repeat bg-left bg-contain"
          style={{ backgroundImage: `url(${BlackX})` }}
        />
      </div>

      <div className="justify-center text-center relative px-4 py-20" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-10 px-6 py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-xl font-semibold text-[#DE8F5A]">Past Events</h2>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-20 flex flex-col-reverse md:flex-row">
        {loading ? (
          <p className="text-center text-gray-600 w-full">Loading events...</p>
        ) : error ? (
          <p className="text-center text-red-600 w-full">{error}</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-600 w-full">No past events found.</p>
        ) : (
          <>
            <div className="w-full md:w-1/2 p-4">
              {events.map((event, index) => (
                <motion.div
                  key={`${event.id}-${index}`}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 50, damping: 10 }}
                  className="mb-10"
                >
                  <div
                    onClick={() => openModal(event)}
                    className="block relative overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-500 w-full md:w-xl md:ml-20 cursor-pointer"
                  >
                    <img
                      src={event.picture || "/placeholder.jpg"}
                      alt={event.title}
                      className="w-full h-60 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500 flex flex-col justify-end">
                      <div className="relative z-10 text-white p-4">
                        <h3 className="text-2xl md:text-4xl font-extrabold text-white max-w-md ml-4 mb-2">
                          "{event.theme || "Inspiring Ideas"}"
                        </h3>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="w-full md:w-1/2 pt-3 md:-ml-10 mb-8 flex flex-col justify-between">
              {events.map((event, index) => (
                <motion.div
                  key={`${event.id}-${index}-desc`}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 50, damping: 10 }}
                  className="flex flex-col space-y-4 mb-8"
                >
                  <h2 className="text-3xl md:text-5xl font-extrabold text-black">{event.title}</h2>
                  <p className="text-base md:text-xl font-medium text-black max-w-lg mb-4">
                    {event.description || "No description available."}
                  </p>
                  <div className="flex flex-col space-y-2">
                    <p className="text-md font-bold flex items-center gap-1 mb-4">
                      <FaCalendar className="w-5 h-5 text-[#EB0028] mr-2" />{" "}
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-md font-bold flex items-center gap-1">
                      <FaMapMarkerAlt className="w-5 h-5 text-[#EB0028] mr-2" /> {event.location}
                    </p>
                  </div>
                </motion.div>
              ))}
         
            </div>
          </>
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