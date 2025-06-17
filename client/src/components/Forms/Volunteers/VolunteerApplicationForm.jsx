import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from '../../../../api.js';

// Dynamic content configuration
const formConfig = {
  title: "Volunteer Application Form",
  subtitle: "Please fill out the form carefully. We will contact selected applicants via email.",
  contactEmail: "contact@tedxuoalgiers.com",
  submitButton: {
    text: "Submit"
  },
  fields: {
    fullName: { label: "Full Name", required: true },
    email: { label: "Email Address", required: true },
    phoneNumber: { label: "Phone Number", required: false },
    age: { label: "Age", required: true },
    cityCountry: { label: "City & Country of Residence", required: true },
    linkedin: { label: "LinkedIn Profile (Optional)", required: false },
    commitment: { label: "How much time can you commit per week?", required: true, options: ["2-4 hours", "5-7 hours", "8+ hours"] },
    priorExperience: { label: "Do you have prior experience in volunteering or event management?", required: true, options: ["Yes", "No"] },
    roles: { label: "Volunteer Roles (Select Your Interests)", required: true, options: ["Day Volunteer", "Marketing & Social Media", "Photography & Videography", "Graphic & Motion Design", "Other"] },
    whyVolunteer: { label: "Why Do You Want to Volunteer with us?", required: true, maxWords: 250 },
    whatAdd: { label: "What will you add to our events?", required: true, maxWords: 250 },
    additionalComments: { label: "Any Additional Comments or Questions?", required: false }
  }
};

export default function VolunteerApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    age: "",
    cityCountry: "",
    linkedin: "",
    commitment: "",
    priorExperience: "",
    priorExperienceDetails: "",
    roles: [],
    otherRole: "",
    whyVolunteer: "",
    whatAdd: "",
    additionalComments: ""
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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newRoles = checked
        ? [...prev.roles, value]
        : prev.roles.filter((role) => role !== value);
      return { ...prev, roles: newRoles };
    });
    setFormStatus({ message: "", type: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ message: "", type: "" });

    // Validate required fields
    const requiredFields = Object.keys(formConfig.fields).filter(
      (field) => formConfig.fields[field].required
    );
    for (const field of requiredFields) {
      if (field === "roles" && formData.roles.length === 0) {
        setFormStatus({ message: "Please select at least one volunteer role", type: "error" });
        setIsSubmitting(false);
        return;
      }
      if (field !== "roles" && !formData[field]) {
        setFormStatus({ message: `${formConfig.fields[field].label} is required`, type: "error" });
        setIsSubmitting(false);
        return;
      }
    }

    // Validate word counts
    const wordCounts = {
      whyVolunteer: countWords(formData.whyVolunteer),
      whatAdd: countWords(formData.whatAdd),
    };
    if (wordCounts.whyVolunteer > formConfig.fields.whyVolunteer.maxWords) {
      setFormStatus({
        message: `Why Volunteer exceeds ${formConfig.fields.whyVolunteer.maxWords} words (current: ${wordCounts.whyVolunteer})`,
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }
    if (wordCounts.whatAdd > formConfig.fields.whatAdd.maxWords) {
      setFormStatus({
        message: `What will you add exceeds ${formConfig.fields.whatAdd.maxWords} words (current: ${wordCounts.whatAdd})`,
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/volunteers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus({ message: "Application submitted successfully! We'll contact you soon.", type: "success" });
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          age: "",
          cityCountry: "",
          linkedin: "",
          commitment: "",
          priorExperience: "",
          priorExperienceDetails: "",
          roles: [],
          otherRole: "",
          whyVolunteer: "",
          whatAdd: "",
          additionalComments: ""
        });
      } else {
        console.error('Backend error:', result);
        setFormStatus({ message: result.error || "Failed to submit application. Please try again.", type: "error" });
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-10 mb-20">
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mb-6 sm:mb-8 md:min-w-5xl md:-ml-5">
            {formConfig.title}
          </h1>
          <p className="text-lg sm:text-xl text-black mb-20">
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

            {/* Personal Information Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Personal Information</h2>
              {["fullName", "email", "phoneNumber", "age", "cityCountry", "linkedin"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                    {formConfig.fields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={fieldName === 'email' ? 'email' : fieldName === 'phoneNumber' ? 'tel' : fieldName === 'age' ? 'number' : 'text'}
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    placeholder={formConfig.fields[fieldName].label}
                    required={formConfig.fields[fieldName].required}
                    min={fieldName === 'age' ? 16 : undefined}
                  />
                </div>
              ))}
            </motion.div>

            {/* Availability & Commitment Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Availability & Commitment</h2>
              <div className="mb-4">
                <label htmlFor="commitment" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.commitment.label}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="commitment"
                  name="commitment"
                  value={formData.commitment}
                  onChange={handleChange}
                  className="cursor-pointer w-full p-2 sm:p-3 border border-gray-300 rounded bg-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {formConfig.fields.commitment.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="priorExperience" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.priorExperience.label}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="priorExperience"
                  name="priorExperience"
                  value={formData.priorExperience}
                  onChange={handleChange}
                  className="cursor-pointer w-full p-2 sm:p-3 border border-gray-300 rounded bg-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {formConfig.fields.priorExperience.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formData.priorExperience === "Yes" && (
                  <input
                    type="text"
                    name="priorExperienceDetails"
                    value={formData.priorExperienceDetails}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Please provide details of your experience"
                  />
                )}
              </div>
            </motion.div>

            {/* Volunteer Roles Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">{formConfig.fields.roles.label}</h2>
              <p className="text-sm text-gray-600 mb-2">Select at least one role *</p>
              {formConfig.fields.roles.options.map((role) => (
                <div key={role} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`role-${role}`}
                    name="roles"
                    value={role}
                    checked={formData.roles.includes(role)}
                    onChange={handleCheckboxChange}
                    className="mr-2 h-4 w-4 accent-red-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor={`role-${role}`} className="text-sm text-black font-medium">
                    {role}
                  </label>
                </div>
              ))}
              {formData.roles.includes("Other") && (
                <input
                  type="text"
                  name="otherRole"
                  value={formData.otherRole}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                  placeholder="Please specify other role"
                />
              )}
            </motion.div>

            {/* Why Volunteer and What Add Section */}
            {["whyVolunteer", "whatAdd"].map((fieldName) => (
              <motion.div key={fieldName} variants={itemVariants}>
                <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields[fieldName].label}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={fieldName}
                  name={fieldName}
                  value={formData[fieldName]}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  rows="4"
                  placeholder={formConfig.fields[fieldName].label}
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  {countWords(formData[fieldName])}/{formConfig.fields[fieldName].maxWords} words
                </p>
              </motion.div>
            ))}

            {/* Additional Comments Section */}
            <motion.div variants={itemVariants}>
              <label htmlFor="additionalComments" className="block text-sm font-bold text-black mb-1">
                {formConfig.fields.additionalComments.label}
              </label>
              <textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                rows="4"
                placeholder={formConfig.fields.additionalComments.label}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                className={`cursor-pointer w-full rounded-full px-4 py-2 sm:px-6 sm:py-3 text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isSubmitting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-600'
                }`}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : formConfig.submitButton.text}
              </motion.button>
              <p className="text-sm text-black mt-4">We will review your application and contact you soon!</p>
              <p className="text-sm text-black mt-2">
                For inquiries, reach us at{' '}
                <a href={`mailto:${formConfig.contactEmail}`} className="text-red-600 hover:underline">
                  {formConfig.contactEmail}
                </a>
              </p>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}