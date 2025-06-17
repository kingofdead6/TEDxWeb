import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail } from 'lucide-react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_BASE_URL } from "../../../../api";

// Dynamic content configuration
const formConfig = {
  title: "TEDx Registration Form",
  subtitle: "Join our TEDx community by completing the form below. We’re excited to have you at our upcoming event!",
  contactEmail: "contact@tedxuoalgiers.com ",
  submitButton: {
    text: "Submit Registration",
    submittingText: "Submitting...",
  },
  fields: {
    fullName: { label: "Full Name", required: true, type: "text" },
    email: { label: "Email Address", required: true, type: "email" },
    phoneNumber: { label: "Phone Number", required: true, type: "tel" },
    dateOfBirth: { label: "Date of Birth", required: true, type: "date" },
    gender: { label: "Gender", required: false, type: "radio", options: ["Male", "Female"] },
    cityCountry: { label: "City & Country of Residence", required: true, type: "text" },
    occupation: { label: "Occupation / Field of Study", required: true, type: "text" },
    companyUniversity: { label: "Company / University", required: true, type: "text" },
    reasonToAttend: { label: "Why do you want to attend?", required: true, type: "textarea" },
    attendedBefore: { label: "Have you attended a TEDx event before?", required: true, type: "radio", options: ["Yes", "No"] },
    previousEvents: { label: "If yes, which event(s)?", required: false, type: "text" },
    howHeard: { label: "How did you hear about this event?", required: true, type: "radio", options: ["Social Media", "Friend/Colleague", "TEDx Website", "University/Workplace", "Other"] },
    howHeardOther: { label: "Specify Other Source", required: false, type: "text" },
    dietaryRestrictions: { label: "Do you have any dietary restrictions?", required: false, type: "text" },
    interests: { label: "What topics are you most interested in?", required: true, type: "checkbox", options: ["Technology", "Science", "Arts", "Business", "Social Impact", "Innovation", "Other"] },
    interestsOther: { label: "Specify Other Interest", required: false, type: "text" },
    receiveUpdates: { label: "Would you like to receive updates about future TEDxAlgeria events?", required: false, type: "radio", options: ["Yes", "No"] }
  }
};

export default function RegistrationForm() {
  const { eventId } = useParams(); // Extract eventId
  const navigate = useNavigate(); // For redirecting on error
  const [eventTitle, setEventTitle] = useState(""); // Store fetched event title
  const [isLoadingEvent, setIsLoadingEvent] = useState(true); // Track event fetch status
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission status

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    cityCountry: "",
    occupation: "",
    companyUniversity: "",
    eventChoice: "",
    reasonToAttend: "",
    attendedBefore: "",
    previousEvents: "",
    howHeard: "",
    howHeardOther: "",
    dietaryRestrictions: "",
    interests: [],
    interestsOther: "",
    receiveUpdates: "",
  });

  // Fetch event title from backend
  useEffect(() => {
    console.log("Event ID from useParams:", eventId); // Debug log
    const fetchEvent = async () => {
      if (!eventId) {
        console.error("No eventId provided in URL");
        toast.error("Invalid event ID");
        navigate("/events");
        return;
      }

      try {
        console.log(`Fetching event for ID: ${eventId}`);
        const response = await axios.get(`${API_BASE_URL}/events/${eventId}`);
        console.log("API response:", response.data);
        const { title } = response.data;
        if (!title) {
          throw new Error("Event title not found");
        }
        console.log(`Setting event title: ${title}`); // Confirm title
        setEventTitle(title);
        setFormData((prev) => ({ ...prev, eventChoice: title }));
      } catch (error) {
        console.error("Error fetching event:", error);
        const errorMessage = error.response?.data?.message || "Failed to load event details";
        toast.error(errorMessage);
        navigate("/events");
      } finally {
        setIsLoadingEvent(false);
      }
    };

    fetchEvent();
  }, [eventId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting form with data:", { ...formData, eventId });
      const response = await axios.post(`${API_BASE_URL}/registrations/attendee`, {
        ...formData,
        eventId,
      });

      toast.success("Registration successful! Please check your email for your QR code.", {
        duration: 5000,
      });
      console.log("Registration response:", response.data);
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        cityCountry: "",
        occupation: "",
        companyUniversity: "",
        eventChoice: eventTitle,
        reasonToAttend: "",
        attendedBefore: "",
        previousEvents: "",
        howHeard: "",
        howHeardOther: "",
        dietaryRestrictions: "",
        interests: [],
        interestsOther: "",
        receiveUpdates: "",
      });
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
      if (errorMessage.includes("Event not found")) {
        toast.error("Invalid event ID. Redirecting to events page...");
        setTimeout(() => navigate("/events"), 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-black">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mb-20">
      <Toaster position="top-center" />
      <div className="justify-center bg-white text-center relative px-4 mb-6 sm:mb-6" dir="ltr">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-8 sm:mb-16 px-4 sm:px-6 py-1 sm:py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#DE8F5A]">Register Now</h2>
        </motion.div>
      </div>

      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mb-6 sm:mb-8">
            {formConfig.title}
          </h1>
          <p className="text-lg sm:text-xl text-black mb-20">
            {formConfig.subtitle}
          </p>
          {formData.eventChoice && (
            <p className="text-lg sm:text-xl text-black mb-4">
              Registering for: <span className="font-semibold">{formData.eventChoice}</span>
            </p>
          )}
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-[#F3F3F3] p-4 sm:p-6 md:p-8 rounded-lg hover:shadow-xl shadow-red-600 transition duration-300 hover:scale-[1.01] sm:hover:scale-105"
          variants={itemVariants}
        >
          <div className="space-y-6">
            {/* Personal Information Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Personal Information</h2>
              {["fullName", "email", "phoneNumber", "dateOfBirth", "cityCountry", "occupation", "companyUniversity"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                    {formConfig.fields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={formConfig.fields[fieldName].type}
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    placeholder={formConfig.fields[fieldName].label}
                    required={formConfig.fields[fieldName].required}
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.gender.label}
                </label>
                <div className="flex space-x-4">
                  {formConfig.fields.gender.options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value={option}
                        checked={formData.gender === option}
                        onChange={handleChange}
                        className="mr-2 accent-red-500 cursor-pointer"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Event Experience Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Event Experience</h2>
              <div className="mb-4">
                <label htmlFor="reasonToAttend" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.reasonToAttend.label}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="reasonToAttend"
                  name="reasonToAttend"
                  value={formData.reasonToAttend}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  placeholder="Share your motivation for attending"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.attendedBefore.label}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  {formConfig.fields.attendedBefore.options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="attendedBefore"
                        value={option}
                        checked={formData.attendedBefore === option}
                        onChange={handleChange}
                        className="mr-2 accent-red-500 cursor-pointer"
                        required
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {formData.attendedBefore === "Yes" && (
                  <input
                    type="text"
                    id="previousEvents"
                    name="previousEvents"
                    value={formData.previousEvents}
                    onChange={handleChange}
                    className="mt-2 w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    placeholder={formConfig.fields.previousEvents.label}
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.howHeard.label}
                  <span className="text-red-500">*</span>
                </label>
                {formConfig.fields.howHeard.options.map((option) => (
                  <label key={option} className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="howHeard"
                      value={option}
                      checked={formData.howHeard === option}
                      onChange={handleChange}
                      className="mr-2 accent-red-500 cursor-pointer"
                      required
                    />
                    {option}
                  </label>
                ))}
                {formData.howHeard === "Other" && (
                  <input
                    type="text"
                    id="howHeardOther"
                    name="howHeardOther"
                    value={formData.howHeardOther}
                    onChange={handleChange}
                    className="mt-2 w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    placeholder={formConfig.fields.howHeardOther.label}
                  />
                )}
              </div>
            </motion.div>

            {/* Additional Information Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Additional Information</h2>
              <div className="mb-4">
                <label htmlFor="dietaryRestrictions" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.dietaryRestrictions.label}
                </label>
                <input
                  type="text"
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none"
                  placeholder={formConfig.fields.dietaryRestrictions.label}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.interests.label}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {formConfig.fields.interests.options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        name="interests"
                        value={option}
                        checked={formData.interests.includes(option)}
                        onChange={handleChange}
                        className="mr-2 accent-red-500 cursor-pointer"
                      />
                      {option}
                    </label>
                  ))}
                </div>
                {formData.interests.includes("Other") && (
                  <input
                    type="text"
                    id="interestsOther"
                    name="interestsOther"
                    value={formData.interestsOther}
                    onChange={handleChange}
                    className="mt-2 w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    placeholder={formConfig.fields.interestsOther.label}
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.receiveUpdates.label}
                </label>
                <div className="flex space-x-4">
                  {formConfig.fields.receiveUpdates.options.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="receiveUpdates"
                        value={option}
                        checked={formData.receiveUpdates === option}
                        onChange={handleChange}
                        className="mr-2 accent-red-500 cursor-pointer"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="cursor-pointer w-full rounded-full bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 hover:bg-red-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? formConfig.submitButton.submittingText : formConfig.submitButton.text}
              </motion.button>
              <p className="text-sm text-black mt-4">We look forward to welcoming you to our TEDx community! 🚀</p>
              <p className="text-sm text-black mt-4">
                For inquiries, reach us at <a href={`mailto:${formConfig.contactEmail}`} className="text-red-600 hover:underline">{formConfig.contactEmail}</a>
              </p>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};