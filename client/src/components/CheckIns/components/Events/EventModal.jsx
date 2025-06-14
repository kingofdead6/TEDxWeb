import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlayCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
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

  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
    responsibleIds: event.responsibles?.map((r) => r.id) || [],
    speakerIds: event.speakers?.map((s) => s.id) || [],
    partnerIds: event.partners?.map((p) => p.id) || [],
  });
  const [formError, setFormError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [picturePreview, setPicturePreview] = useState(event.picture || null);
  const [galleryPreviews, setGalleryPreviews] = useState(event.gallery || []);

  // Retry logic for API calls
  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, options);
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  // Fetch users, speakers, and partners
  useEffect(() => {
    if (isEditing) {
      const fetchData = async () => {
        setFormError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to access this page", {
            style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
          });
          navigate("/login");
          return;
        }

        try {
          const headers = { Authorization: `Bearer ${token}` };
          const [usersRes, speakersRes, partnersRes] = await Promise.all([
            fetchWithRetry(`${API_BASE_URL}/admin/users`, { headers }).catch(() => ({ data: [] })),
            fetchWithRetry(`${API_BASE_URL}/speakers`, { headers }).catch(() => ({ data: [] })),
            fetchWithRetry(`${API_BASE_URL}/partners`, { headers }).catch(() => ({ data: [] })),
          ]);

          setUsers(usersRes.data);
          setSpeakers(speakersRes.data);
          setPartners(partnersRes.data);

          if (!partnersRes.data.length) {
            toast.warn("No partners fetched. You can still update an event without partners.", {
              style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
            });
          }
          if (!usersRes.data.length) {
            toast.warn("No non-admin users fetched. You can still update an event without responsibles.", {
              style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
            });
          }
        } catch (err) {
          console.error("Fetch error:", err);
          setFormError("Failed to fetch data. Please check your network or database connection.");
          toast.error(
            err.response?.data?.message || "Failed to fetch data. Please try again later.",
            {
              style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
            }
          );
        }
      };
      fetchData();
    }
  }, [isEditing, navigate]);

  const handleFileChange = (e, field) => {
    if (field === "picture") {
      const file = e.target.files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error("Picture file size must be less than 5MB", {
          style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
        });
        return;
      }
      if (file) {
        setPicturePreview(URL.createObjectURL(file));
      } else {
        setPicturePreview(null);
      }
      setFormData({ ...formData, picture: file });
    } else if (field === "gallery") {
      const files = Array.from(e.target.files).slice(0, 10);
      if (files.some((file) => file.size > 5 * 1024 * 1024)) {
        toast.error("Each gallery image must be less than 5MB", {
          style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
        });
        return;
      }
      setGalleryPreviews(files.map((file) => URL.createObjectURL(file)));
      setFormData({ ...formData, gallery: files });
    }
  };

  const handleMultiSelect = (selectedOptions, field) => {
    const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFormData({ ...formData, [field]: values });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.location.trim() || !formData.theme.trim()) {
      toast.error("Please fill in all required fields (Title, Date, Location, Theme)", {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to update an event", {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
      navigate("/login");
      setIsLoading(false);
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("date", new Date(formData.date).toISOString());
    form.append("description", formData.description || "");
    form.append("location", formData.location);
    form.append("theme", formData.theme);
    form.append("watchTalks", formData.watchTalks || "");
    form.append("seats", formData.seats || "");
    form.append("isRegistrationOpen", formData.isRegistrationOpen.toString());
    if (formData.responsibleIds.length) {
      formData.responsibleIds.forEach((id) => form.append("responsibles[]", id));
    }
    if (formData.speakerIds.length) {
      formData.speakerIds.forEach((id) => form.append("speakerIds[]", id));
    }
    if (formData.partnerIds.length) {
      formData.partnerIds.forEach((id) => form.append("partnerIds[]", id));
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
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Event updated successfully!", {
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          border: "1px solid #059669",
        },
      });
      onUpdate(response.data);
      setIsEditing(false);
      setFormError(null);
      setPicturePreview(response.data.picture || null);
      setGalleryPreviews(response.data.gallery || []);
    } catch (err) {
      console.error("Update event error:", err);
      const errorMessage = err.response?.data?.message || "Failed to update event";
      setFormError(errorMessage);
      toast.error(errorMessage, {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.", {
          style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
        });
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_BASE_URL}/events/${event.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Event deleted successfully!", {
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          border: "1px solid #059669",
        },
      });
      onClose();
      onUpdate(null);
    } catch (err) {
      console.error("Delete event error:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete event";
      setFormError(errorMessage);
      toast.error(errorMessage, {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
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

  // react-select custom styles
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "1px solid #d1d5db",
      borderRadius: "0.375rem",
      fontSize: "1.25rem",
      padding: "0.5rem",
      minHeight: "48px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      color: "#000",
      zIndex: 9999,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
      color: "#000",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#000",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    option: (provided) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  // Options for react-select
  const responsibleOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));
  const speakerOptions = speakers.map((speaker) => ({
    value: speaker.id,
    label: speaker.fullName,
  }));
  const partnerOptions = partners.map((partner) => ({
    value: partner.id,
    label: partner.organizationName,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-red-900 to-black/80 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <Toaster position="top-center" />
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
              .input-field {
                width: 100%;
                padding: 0.5rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                font-size: 1.25rem;
                background-color: rgba(255, 255, 255, 0.9);
                color: #000;
                outline: none;
                transition: border-color 0.2s;
              }
              .input-field:focus {
                border-color: #ef4444;
                ring: 2px solid #ef4444;
              }
              .checkbox-field {
                accent-color: #ef4444;
                width: 1.25rem;
                height: 1.25rem;
                margin-right: 0.5rem;
                cursor: pointer;
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
                src={picturePreview || "/placeholder.jpg"}
                alt={formData.title}
                className="w-full h-[80vh] object-cover rounded-4xl shadow-lg"
              />
              <div
                className="rounded-4xl absolute inset-0"
                style={{
                  background: "linear-gradient(to top, #EB0028C9 10%, transparent 100%)",
                }}
              ></div>
              {isEditing ? (
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-extrabold text-white drop-shadow-lg shadow-2xl bg-transparent border-b-2 border-white text-center"
                  required
                />
              ) : (
                <h3 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl font-extrabold text-white drop-shadow-lg shadow-2xl">
                  {event.title}
                </h3>
              )}
            </div>
            {formError && (
              <div className="mb-6 p-3 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <p className="text-xl">
                    <strong className="text-3xl font-semibold">ID:</strong> {event.id}
                  </p>
                  {isEditing ? (
                    <>
                      <div>
                        <strong className="text-3xl font-semibold">Date:</strong>
                        <input
                          id="date"
                          type="datetime-local"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="input-field mt-2"
                          required
                        />
                      </div>
                      <div>
                        <strong className="text-3xl font-semibold">Location:</strong>
                        <input
                          id="location"
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="input-field mt-2"
                          required
                        />
                      </div>
                      <div>
                        <strong className="text-3xl font-semibold">Theme:</strong>
                        <input
                          id="theme"
                          type="text"
                          value={formData.theme}
                          onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                          className="input-field mt-2"
                          required
                        />
                      </div>
                      <div>
                        <strong className="text-3xl font-semibold">Description:</strong>
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="input-field mt-2 min-h-[100px] resize-y"
                        />
                      </div>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Created By:</strong>{" "}
                        {event.createdBy?.name || "N/A"}
                      </p>
                      <div>
                        <strong className="text-3xl font-semibold">Responsibles:</strong>
                        <Select
                          isMulti
                          options={responsibleOptions}
                          value={responsibleOptions.filter((option) =>
                            formData.responsibleIds.includes(option.value)
                          )}
                          onChange={(selected) => handleMultiSelect(selected, "responsibleIds")}
                          styles={selectStyles}
                          className="mt-2"
                          placeholder="Select responsibles..."
                        />
                      </div>
                      <div>
                        <strong className="text-3xl font-semibold">Speakers:</strong>
                        <Select
                          isMulti
                          options={speakerOptions}
                          value={speakerOptions.filter((option) =>
                            formData.speakerIds.includes(option.value)
                          )}
                          onChange={(selected) => handleMultiSelect(selected, "speakerIds")}
                          styles={selectStyles}
                          className="mt-2"
                          placeholder="Select speakers..."
                        />
                      </div>
                      <div>
                        <strong className="text-3xl font-semibold">Partners:</strong>
                        <Select
                          isMulti
                          options={partnerOptions}
                          value={partnerOptions.filter((option) =>
                            formData.partnerIds.includes(option.value)
                          )}
                          onChange={(selected) => handleMultiSelect(selected, "partnerIds")}
                          styles={selectStyles}
                          className="mt-2"
                          placeholder="Select partners..."
                        />
                      </div>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Check-ins:</strong> {event.checkins || 0}
                      </p>
                      <div>
                        <strong className="text-3xl font-semibold">Watch Talks:</strong>
                        <input
                          id="watchTalks"
                          type="url"
                          value={formData.watchTalks}
                          onChange={(e) => setFormData({ ...formData, watchTalks: e.target.value })}
                          className="input-field mt-2"
                        />
                      </div>
                      <div>
                        <strong className="text-3xl font-semibold">Seats Available:</strong>
                        <input
                          id="seats"
                          type="number"
                          value={formData.seats}
                          onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                          className="input-field mt-2"
                        />
                      </div>
                      <div className="flex items-center">
                        <strong className="text-3xl font-semibold">Registration Open:</strong>
                        <input
                          id="isRegistrationOpen"
                          type="checkbox"
                          checked={formData.isRegistrationOpen}
                          onChange={(e) =>
                            setFormData({ ...formData, isRegistrationOpen: e.target.checked })
                          }
                          className="checkbox-field ml-2"
                        />
                      </div>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Created At:</strong>{" "}
                        {new Date(event.createdAt).toLocaleString("en-GB")}
                      </p>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Updated At:</strong>{" "}
                        {new Date(event.updatedAt).toLocaleString("en-GB")}
                      </p>
                      <div>
                        <strong className="text-3xl font-semibold">Event Picture:</strong>
                        <input
                          id="picture"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, "picture")}
                          className="input-field mt-2"
                        />
                        {picturePreview && (
                          <img
                            src={picturePreview}
                            alt="Picture Preview"
                            className="mt-2 w-full max-w-xs rounded-lg shadow-md"
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Date:</strong>{" "}
                        {new Date(event.date).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
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
                        <strong className="text-3xl font-semibold">Created By:</strong>{" "}
                        {event.createdBy?.name || "N/A"}
                      </p>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Responsibles:</strong>{" "}
                        {event.responsibles?.map((r) => r.name).join(", ") || "None"}
                      </p>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Speakers:</strong>{" "}
                        {event.speakers?.map((s) => s.fullName).join(", ") || "None"}
                      </p>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Partners:</strong>{" "}
                        {event.partners?.map((p) => p.organizationName).join(", ") || "None"}
                      </p>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Check-ins:</strong> {event.checkins || 0}
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
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Registration Open:</strong>{" "}
                        {event.isRegistrationOpen ? "Yes" : "No"}
                      </p>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Created At:</strong>{" "}
                        {new Date(event.createdAt).toLocaleString("en-GB")}
                      </p>
                      <p className="text-xl">
                        <strong className="text-3xl font-semibold">Updated At:</strong>{" "}
                        {new Date(event.updatedAt).toLocaleString("en-GB")}
                      </p>
                    </>
                  )}
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
                      <>
                        {isEditing ? (
                          <>
                            <motion.button
                              type="submit"
                              className="cursor-pointer px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500/50 text-xl font-semibold shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={isLoading}
                              aria-label="Save event"
                            >
                              {isLoading ? "Saving..." : "Save Changes"}
                            </motion.button>
                            <motion.button
                              type="button"
                              onClick={() => setIsEditing(false)}
                              className="cursor-pointer px-8 py-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-500/50 text-xl font-semibold shadow-lg"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={isLoading}
                              aria-label="Cancel edit"
                            >
                              Cancel
                            </motion.button>
                          </>
                        ) : (
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
                        <motion.button
                          onClick={() => setIsDeleting(true)}
                          className="cursor-pointer px-8 py-4 bg-red-700 text-white rounded-lg hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-700/50 text-xl font-semibold shadow-lg"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Delete event"
                        >
                          Delete Event
                        </motion.button>
                      </>
                    )}
                  </div>
                  {isDeleting && (
                    <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md border border-red-200">
                      <p className="mb-2">Are you sure you want to delete this event?</p>
                      <div className="flex gap-3">
                        <motion.button
                          onClick={handleDelete}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isLoading}
                        >
                          {isLoading ? "Deleting..." : "Confirm Delete"}
                        </motion.button>
                        <motion.button
                          onClick={() => setIsDeleting(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={isLoading}
                        >
                          Cancel
                        </motion.button>
                      </div>
                      {formError && <p className="mt-2 text-sm">{formError}</p>}
                    </div>
                  )}
                </div>
                <div>
                  {isEditing ? (
                    <div>
                      <strong className="text-3xl font-semibold">Gallery Images:</strong>
                      <input
                        id="gallery"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e, "gallery")}
                        className="input-field mt-2"
                      />
                      {galleryPreviews.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {galleryPreviews.map((preview, index) => (
                            <img
                              key={index}
                              src={preview}
                              alt={`Gallery Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg shadow-md"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : event.gallery && event.gallery.length > 0 ? (
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
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EventModal;