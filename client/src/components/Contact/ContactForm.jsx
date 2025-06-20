import { useState } from "react";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaTiktok } from "react-icons/fa";
import { Phone, Mail } from 'lucide-react';
import { API_BASE_URL } from '../../../api.js';

// Dynamic content configuration
const contactConfig = {
  title: "Get in Touch",
  subtitle: "We look forward to connecting with you!",
  contactInfo: {
    email: "contact@tedxuoalgiers.com",
    website: "www.tedxalgeria.com"
  },
  socialMedia: {
    title: "Follow us on:",
    links: [
      { icon: <FaInstagram size={24} />, url: "https://www.instagram.com/tedxalgiers" },
      { icon: <FaLinkedin size={24} />, url: "https://www.linkedin.com/company/tedxalgeria" },
    ]
  },
  formFields: {
    fullName: { label: "Full Name", required: true },
    email: { label: "Email Address", required: true },
    phoneNumber: { label: "Phone Number", required: false },
    organization: { label: "Organization/Company (if applicable)", required: false },
    reason: { label: "Reason for Contacting Us", required: true, options: ["General Inquiry", "Sponsorship & Partnership", "Media & Press", "Volunteering", "Speaker/Performer Application", "Other"] },
    message: { label: "Your Message", required: true },
    preferredContact: { label: "Preferred Method of Contact", required: true, options: ["Email", "Phone", "No preference"] },
    hearAboutUs: { label: "How Did You Hear About Us?", required: true, options: ["Social Media", "Website", "Friend/Colleague", "Previous TEDx Event", "Other"] }
  },
  submitButton: {
    text: "Submit Inquiry"
  }
};

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    organization: "",
    reason: "",
    message: "",
    preferredContact: "",
    hearAboutUs: "",
    otherReason: "",
    otherHear: "", 
    isSeen: false
  });
  const [formStatus, setFormStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Word count helper
  const countWords = (text) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus({ message: "", type: "" });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus({ message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: "", type: "" });

    // Validate required fields
    const requiredFields = Object.keys(contactConfig.formFields).filter(
      (field) => contactConfig.formFields[field].required
    );
    for (const field of requiredFields) {
      if (!formData[field]) {
        setFormStatus({ message: `${contactConfig.formFields[field].label} is required`, type: "error" });
        setIsSubmitting(false);
        return;
      }
    }

    // Validate message word count (≤500 words)
    const messageWords = countWords(formData.message);
    if (messageWords > 500) {
      setFormStatus({
        message: `Your Message exceeds 500 words (current: ${messageWords})`,
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }


    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus({ message: "Inquiry submitted successfully! We'll get back to you soon.", type: "success" });
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          organization: "",
          reason: "",
          message: "",
          preferredContact: "",
          hearAboutUs: "",
          otherReason: "",
          otherHear: "", 
          isSeen: false
        });
      } else {
        setFormStatus({ message: result.error || "Failed to submit inquiry. Please try again.", type: "error" });
      }
    } catch (error) {
      setFormStatus({ message: "An error occurred. Please check your connection and try again.", type: "error" });
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20 sm:mt-20 mb-20">
      
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row gap-8 sm:gap-20">
          {/* Left Column - Contact Info */}
          <motion.div 
            className="md:w-1/2 space-y-6 sm:space-y-8"
            variants={itemVariants}
          >
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-black mb-4 sm:mb-6">
                {contactConfig.title}
              </h1>
              <p className="text-black text-xl sm:text-3xl">
                {contactConfig.subtitle}
              </p>
            </div>
            <div className="border border-black rounded-lg w-full md:w-[80%]" />

            <div className="space-y-4">
              {/* Phone */}
             
              {/* Email */}
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 p-2 sm:p-3 rounded-full">
                  <Mail className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <p className="text-black font-semibold text-base sm:text-lg">
                  <a href={`mailto:${contactConfig.contactInfo.email}`} className="hover:text-red-600">
                    {contactConfig.contactInfo.email}
                  </a>
                </p>
              </div>
              {/* Website */}
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 p-2 sm:p-3 rounded-full">
                  <svg className="text-white w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <p className="text-black font-semibold text-base sm:text-lg">
                  <a href={`https://${contactConfig.contactInfo.website}`} className="hover:text-red-600" target="_blank" rel="noopener noreferrer">
                    {contactConfig.contactInfo.website}
                  </a>
                </p>
              </div>
            </div>

            <div className="border border-black rounded-lg w-full md:w-[80%]" />

            <div className="">
              <p className="text-black text-xl sm:text-3xl font-medium -mt-3 sm:-mt-5 mb-3 sm:mb-4">
                {contactConfig.socialMedia.title}
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {contactConfig.socialMedia.links.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    className="text-red-600 hover:text-red-800"
                    whileHover={{ y: -2 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
            
          </motion.div>

          {/* Right Column - Form Section */}
          <motion.form
            onSubmit={handleSubmit}
            className="md:w-1/2 bg-[#F3F3F3] p-4 sm:p-6 md:p-8 rounded-lg hover:shadow-xl shadow-red-600 transition duration-300 hover:scale-[1.01] sm:hover:scale-105"
            variants={itemVariants}
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Status Message */}
              {formStatus.message && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 rounded ${formStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {formStatus.message}
                </motion.div>
              )}

              {["fullName", "email", "phoneNumber", "organization"].map((fieldName) => (
                <div key={fieldName}>
                  <label htmlFor={fieldName} className="block text-black text-sm font-bold mb-1">
                    {contactConfig.formFields[fieldName].label}
                    {contactConfig.formFields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={fieldName === 'email' ? 'email' : fieldName === 'phoneNumber' ? 'tel' : 'text'}
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    placeholder={contactConfig.formFields[fieldName].label}
                    required={contactConfig.formFields[fieldName].required}
                  />
                </div>
              ))}

              {/* Reason for Contacting Us */}
              <div>
                <label className="block text-black text-sm font-bold mb-1">
                  {contactConfig.formFields.reason.label}
                  <span className="text-red-500">*</span>
                </label>
                {contactConfig.formFields.reason.options.map((option) => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`reason-${option}`}
                      name="reason"
                      value={option}
                      checked={formData.reason === option}
                      onChange={handleRadioChange}
                      className="mr-2 focus:outline-none accent-red-500 cursor-pointer"
                      required
                    />
                    <label htmlFor={`reason-${option}`} className="text-black">
                      {option}
                    </label>
                  </div>
                ))}
                {formData.reason === "Other" && (
                  <input
                    type="text"
                    name="otherReason"
                    value={formData.otherReason}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Please specify"
                  />
                )}
              </div>

              {/* Preferred Method of Contact */}
              <div>
                <label className="block text-black text-sm font-bold mb-1">
                  {contactConfig.formFields.preferredContact.label}
                  <span className="text-red-500">*</span>
                </label>
                {contactConfig.formFields.preferredContact.options.map((option) => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`preferred-${option}`}
                      name="preferredContact"
                      value={option}
                      checked={formData.preferredContact === option}
                      onChange={handleRadioChange}
                      className="mr-2 focus:outline-none accent-red-500 cursor-pointer"
                      required
                    />
                    <label htmlFor={`preferred-${option}`} className="text-black">
                      {option}
                    </label>
                  </div>
                ))}
              </div>

              {/* How Did You Hear About Us? */}
              <div>
                <label className="block text-black text-sm font-bold mb-1">
                  {contactConfig.formFields.hearAboutUs.label}
                  <span className="text-red-500">*</span>
                </label>
                {contactConfig.formFields.hearAboutUs.options.map((option) => (
                  <div key={option} className="flex items-center mb-2">
                    <input
                      type="radio"
                      id={`hear-${option}`}
                      name="hearAboutUs"
                      value={option}
                      checked={formData.hearAboutUs === option}
                      onChange={handleRadioChange}
                      className="mr-2 focus:outline-none accent-red-500 cursor-pointer"
                      required
                    />
                    <label htmlFor={`hear-${option}`} className="text-black">
                      {option}
                    </label>
                  </div>
                ))}
                {formData.hearAboutUs === "Other" && (
                  <input
                    type="text"
                    name="otherHear" // Changed from otherHearAboutUs to otherHear
                    value={formData.otherHear}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Please specify"
                  />
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-black text-sm font-bold mb-1">
                  {contactConfig.formFields.message.label}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  rows="4"
                  placeholder={contactConfig.formFields.message.label}
                  required={contactConfig.formFields.message.required}
                />
                <p className="text-sm text-gray-600 mt-1">
                  {countWords(formData.message)}/500 words
                </p>
              </div>

              <motion.button
                type="submit"
                className={`cursor-pointer w-full rounded-full px-4 py-2 sm:px-6 sm:py-3 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                }`}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : contactConfig.submitButton.text}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}