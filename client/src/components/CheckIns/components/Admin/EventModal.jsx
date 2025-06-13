import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlayCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Select from "react-select";
import { API_BASE_URL } from "../../../../../api";

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

const EventModal = ({ event, isOpen, onClose, userRole, onUpdate }) => {
  if (!isOpen || !event) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: event.title || "",
    date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
    description: event.description || "",
    location: event.location || "",
    theme: event.theme || "",
    watchTalks: event.watchTalks || "",
    seats: event.seats || "",
    isRegistrationOpen: event.isRegistrationOpen || false,
    picture: null,
    gallery: [],
    speakerIds: event.speakers?.map((s) => ({ value: s.id, label: s.fullName })) || [],
    partnerIds: event.partners?.map((p) => ({ value: p.id, label: p.organizationName })) || [],
  });
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [partners, setPartners] = useState([]);

  // Fetch speakers and partners for selection
  useEffect(() => {
    if (isEditing) {
      const fetchData = async () => {
        try {
          const [speakersRes, partnersRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/speakers`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }),
            axios.get(`${API_BASE_URL}/partners`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }),
          ]);
          setSpeakers(speakersRes.data.map((s) => ({ value: s.id, label: s.fullName })));
          setPartners(partnersRes.data.map((p) => ({ value: p.id, label: p.organizationName })));
        } catch (err) {
          console.error("Fetch speakers/partners error:", err);
          setFormError("Failed to load speakers or partners");
        }
      };
      fetchData();
    }
  }, [isEditing]);

  const handleFileChange = (e, field) => {
    if (field === "picture") {
      setFormData({ ...formData, picture: e.target.files[0] });
    } else if (field === "gallery") {
      setFormData({ ...formData, gallery: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.location.trim() || !formData.theme.trim()) {
      setFormError("Title, date, location, and theme are required");
      return;
    }

    setIsLoading(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("date", formData.date);
    form.append("description", formData.description);
    form.append("location", formData.location);
    form.append("theme", formData.theme);
    form.append("watchTalks", formData.watchTalks);
    form.append("seats", formData.seats);
    form.append("isRegistrationOpen", formData.isRegistrationOpen.toString());
    if (formData.speakerIds.length > 0) {
      form.append("speakerIds", JSON.stringify(formData.speakerIds.map((s) => s.value)));
    }
    if (formData.partnerIds.length > 0) {
      form.append("partnerIds", JSON.stringify(formData.partnerIds.map((p) => p.value)));
    }
    if (formData.picture) {
      form.append("picture", formData.picture);
    }
    formData.gallery.forEach((file) => {
      form.append("gallery", file);
    });

    try {
      const response = await axios.put(`${API_BASE_URL}/events/${event.id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      onUpdate(response.data); // Notify parent to update event
      setIsEditing(false);
      setFormError("");
    } catch (err) {
      console.error("Update event error:", err);
      setFormError(err.response?.data?.message || "Failed to update event");
    } finally {
      setIsLoading(false);
    }
  };

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
            {!isEditing ? (
              <>
                <div className="relative mb-12">
                  <img
                    src={event.picture}
                    alt={event.title}
                    className="w-full h-[80vh] object-cover rounded-4xl shadow-lg"
                  />
                  <div
                    className="rounded-4xl absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, #EB0028C9 10%, transparent 100%)",
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
                      <strong className="text-3xl font-semibold">Seats Available:</strong>{" "}
                      {event.seats || "N/A"}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to={`/checkins/events/${event.id}/registrations`}>
                        <motion.button
                          className="cursor-pointer px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500/50 text-xl font-semibold shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="See registered attendees"
                        >
                          See Registered
                        </motion.button>
                      </Link>
                      {userRole === "admin" && (
                        <motion.button
                          onClick={() => setIsEditing(true)}
                          className="cursor-pointer px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/50 text-xl font-semibold shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Edit event details"
                        >
                          Edit Event Details
                        </motion.button>
                      )}
                    </div>
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
              </>
            ) : (
              <div className="space-y-6">
                <h3 className="text-3xl font-bold text-white mb-4">Edit Event</h3>
                {formError && (
                  <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
                    {formError}
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                      Event Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter event title"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-white mb-1">
                      Event Date
                    </label>
                    <input
                      id="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-white mb-1">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter event location"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-white mb-1">
                      Theme
                    </label>
                    <input
                      id="theme"
                      type="text"
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      placeholder="Enter event theme"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter event description"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90 resize-y min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="watchTalks" className="block text-sm font-medium text-white mb-1">
                      Watch Talks URL
                    </label>
                    <input
                      id="watchTalks"
                      type="url"
                      value={formData.watchTalks}
                      onChange={(e) => setFormData({ ...formData, watchTalks: e.target.value })}
                      placeholder="Enter watch talks URL"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90"
                    />
                  </div>
                  <div>
                    <label htmlFor="seats" className="block text-sm font-medium text-white mb-1">
                      Seats Available
                    </label>
                    <input
                      id="seats"
                      type="number"
                      value={formData.seats}
                      onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                      placeholder="Enter number of seats"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isRegistrationOpen"
                      type="checkbox"
                      checked={formData.isRegistrationOpen}
                      onChange={(e) =>
                        setFormData({ ...formData, isRegistrationOpen: e.target.checked })
                      }
                      className="mr-2 accent-red-500 cursor-pointer"
                    />
                    <label htmlFor="isRegistrationOpen" className="text-sm font-medium text-white">
                      Registration Open
                    </label>
                  </div>
                  <div>
                    <label htmlFor="picture" className="block text-sm font-medium text-white mb-1">
                      Event Picture
                    </label>
                    <input
                      id="picture"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "picture")}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90"
                    />
                  </div>
                  <div>
                    <label htmlFor="gallery" className="block text-sm font-medium text-white mb-1">
                      Gallery Images
                    </label>
                    <input
                      id="gallery"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e, "gallery")}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white/90"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Speakers</label>
                    <Select
                      isMulti
                      options={speakers}
                      value={formData.speakerIds}
                      onChange={(selected) => setFormData({ ...formData, speakerIds: selected })}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select speakers..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Partners</label>
                    <Select
                      isMulti
                      options={partners}
                      value={formData.partnerIds}
                      onChange={(selected) => setFormData({ ...formData, partnerIds: selected })}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select partners..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      type="submit"
                      className="cursor-pointer flex-1 bg-red-600 text-white p-3 rounded-md font-medium transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
                      disabled={isLoading}
                      whileHover={!isLoading ? { scale: 1.05 } : {}}
                      whileTap={!isLoading ? { scale: 0.95 } : {}}
                      aria-label="Update event"
                    >
                      {isLoading ? "Updating..." : "Update Event"}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="cursor-pointer flex-1 bg-gray-200 text-gray-800 p-3 rounded-md font-medium hover:bg-gray-300 transition duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Cancel edit"
                      disabled={isLoading}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventModal;