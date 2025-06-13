import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from '../../../../api.js';

// Dynamic content configuration
const formConfig = {
  title: "Press/Media Accreditation Form",
  subtitle: "Please fill out the form carefully. Our team will review applications and grant press access to selected individuals.",
  contactEmail: "contact@tedxuniversityofalgiers.com",
  submitButton: {
    text: "Submit"
  },
  fields: {
    fullName: { label: "Full Name", required: true },
    email: { label: "Email Address", required: true },
    phoneNumber: { label: "Phone Number", required: false },
    mediaOutlet: { label: "Media Outlet/Organization/Independent", required: true },
    position: { label: "Position/Role", required: true, options: ["Journalist", "Blogger", "Vlogger", "Other"] },
    cityCountry: { label: "City & Country", required: true },
    socialLinks: { label: "Website or Social Media Links", required: false },
    coveragePlan: { label: "How do you plan to cover our events?", required: true, options: ["Article", "Interview", "Video Report", "Social Media Coverage", "Other"] },
    pastCoverage: { label: "Have you covered events before?", required: true, options: ["Yes", "No"] },
    interest: { label: "Why are you interested in covering our events?", required: true, maxWords: 200 },
    specialRequirements: { label: "Any special requirements for your coverage?", required: false }
  }
};

export default function PressMediaAccreditationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    mediaOutlet: "",
    position: "",
    cityCountry: "",
    socialLinks: "",
    coveragePlan: "",
    pastCoverage: "",
    interest: "",
    specialRequirements: "",
    otherPosition: "",
    otherCoverage: "",
    pastCoverageLinks: ""
  });
  const [formStatus, setFormStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Word count validation helper
  const countWords = (text) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus({ message: "", type: "" }); // Clear status on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: "", type: "" });

    // Validate word count for interest
    const interestWordCount = countWords(formData.interest);
    if (interestWordCount > formConfig.fields.interest.maxWords) {
      setFormStatus({ message: `Interest exceeds ${formConfig.fields.interest.maxWords} words (current: ${interestWordCount})`, type: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/press`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus({ message: "Application submitted successfully!", type: "success" });
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          mediaOutlet: "",
          position: "",
          cityCountry: "",
          socialLinks: "",
          coveragePlan: "",
          pastCoverage: "",
          interest: "",
          specialRequirements: "",
          otherPosition: "",
          otherCoverage: "",
          pastCoverageLinks: ""
        });
      } else {
        setFormStatus({ message: result.error || "Failed to submit application. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus({ message: "An error occurred. Please try again later.", type: "error" });
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-20 sm:mt-40 mb-20">
      <div className="justify-center bg-white text-center relative px-4 mb-12 sm:mb-20" dir="ltr">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-8 sm:mb-16 px-4 sm:px-6 py-1 sm:py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#DE8F5A]">Apply Now</h2>
        </motion.div>
      </div>
      
      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mb-6 sm:mb-8 md:min-w-5xl md:-ml-25">
            {formConfig.title}
          </h1>
          <p className="text-lg sm:text-xl text-black mb-8">
            {formConfig.subtitle}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-[#F3F3F3] p-4 sm:p-6 md:p-8 rounded-lg hover:shadow-xl shadow-red-600 transition duration-300 hover:scale-[1.01] sm:hover:scale-105"
          variants={itemVariants}
        >
          <div className="space-y-6">
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

            {/* Your Information Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Your Information</h2>
              {["fullName", "email", "phoneNumber", "mediaOutlet", "cityCountry", "socialLinks"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                    {formConfig.fields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={fieldName === 'email' ? 'email' : fieldName === 'phoneNumber' ? 'tel' : 'text'}
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
                <label htmlFor="position" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.position.label}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {formConfig.fields.position.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formData.position === "Other" && (
                  <input
                    type="text"
                    name="otherPosition"
                    value={formData.otherPosition}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Please specify"
                  />
                )}
              </div>
            </motion.div>

            {/* Coverage Details Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Coverage Details</h2>
              <div className="mb-4">
                <label htmlFor="coveragePlan" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.coveragePlan.label}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="coveragePlan"
                  name="coveragePlan"
                  value={formData.coveragePlan}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {formConfig.fields.coveragePlan.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formData.coveragePlan === "Other" && (
                  <input
                    type="text"
                    name="otherCoverage"
                    value={formData.otherCoverage}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Please specify"
                  />
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="pastCoverage" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.pastCoverage.label}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="pastCoverage"
                  name="pastCoverage"
                  value={formData.pastCoverage}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {formConfig.fields.pastCoverage.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formData.pastCoverage === "Yes" && (
                  <input
                    type="text"
                    name="pastCoverageLinks"
                    value={formData.pastCoverageLinks}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Provide links to past coverage"
                  />
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="interest" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.interest.label}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  rows="4"
                  placeholder={formConfig.fields.interest.label}
                  required={formConfig.fields.interest.required}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="specialRequirements" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.specialRequirements.label}
                </label>
                <input
                  type="text"
                  id="specialRequirements"
                  name="specialRequirements"
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  placeholder={formConfig.fields.specialRequirements.label}
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className="cursor-pointer w-full rounded-full bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 hover:bg-red-700 transition font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:shadow-red-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : formConfig.submitButton.text}
              </motion.button>
              <p className="text-sm text-black mt-4">We will review your application and contact approved media representatives!</p>
              <p className="text-sm text-black mt-2">For inquiries, reach us at <a href={`mailto:${formConfig.contactEmail}`} className="text-red-600 hover:underline">{formConfig.contactEmail}</a></p>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}