import { useState } from "react";
import { motion } from "framer-motion";
import { Mail } from 'lucide-react';
import { API_BASE_URL } from '../../../../api.js';

// Dynamic content configuration
const formConfig = {
  title: "Performance Application Form",
  subtitle: "Please complete this form with as much detail as possible. Our team will review applications and select performers based on creativity, originality, and high quality performances.",
  contactEmail: "contact@tedxuoalgiers.com ",
  submitButton: {
    text: "Submit"
  },
  fields: {
    fullName: { label: "Full Name", required: true },
    email: { label: "Email Address", required: true },
    phoneNumber: { label: "Phone Number", required: false },
    team: { label: "Are you part of a team?", required: false },
    cityCountry: { label: "City & Country", required: true },
    socialLinks: { label: "Website or Social Media Links", required: false },
    performanceType: { label: "Type of Performance", required: true },
    performanceTitle: { label: "Performance Title (if applicable)", required: false },
    description: { label: "Brief Description of Your Performance", required: true },
    duration: { label: "Duration of Performance", required: true },
    specialEquipment: { label: "Will you require special equipment or setup? (If Yes, please specify)", required: false },
    sampleLink: { label: "Link to a sample of your performance (video/audio)", required: true },
    additionalComments: { label: "Additional comments or requests", required: false }
  }
};

export default function PerformanceApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    team: "",
    cityCountry: "",
    socialLinks: "",
    performanceType: "",
    performanceTitle: "",
    description: "",
    duration: "",
    specialEquipment: "",
    sampleLink: "",
    additionalComments: ""
  });
  const [pfpFile, setPfpFile] = useState(null);
  const [formStatus, setFormStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormStatus({ message: "", type: "" });
  };

  const handleFileChange = (e) => {
    setPfpFile(e.target.files[0]);
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
      if (!formData[field]) {
        setFormStatus({ message: `${formConfig.fields[field].label} is required`, type: "error" });
        setIsSubmitting(false);
        return;
      }
    }

    // Prepare FormData
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    if (pfpFile) {
      formDataToSend.append('pfp', pfpFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/performers`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus({ message: "Application submitted successfully!", type: "success" });
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          team: "",
          cityCountry: "",
          socialLinks: "",
          performanceType: "",
          performanceTitle: "",
          description: "",
          duration: "",
          specialEquipment: "",
          sampleLink: "",
          additionalComments: ""
        });
        setPfpFile(null);
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mb-6 sm:mb-8 md:min-w-5xl md:-ml-15">
            {formConfig.title}
          </h1>
          <p className="text-lg sm:text-xl text-black mb-12">
            {formConfig.subtitle}
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-[#F3F3F3] p-4 sm:p-6 md:p-8 rounded-lg hover:shadow-xl shadow-red-600 transition duration-300 hover:scale-[1.01] sm:hover:scale-105"
          variants={itemVariants}
          encType="multipart/form-data"
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
              {["fullName", "email", "phoneNumber", "team", "cityCountry", "socialLinks"].map((fieldName) => (
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
                <label htmlFor="pfp" className="block text-sm font-bold text-black mb-1">
                  Profile Picture (Optional)
                </label>
                <input
                  type="file"
                  id="pfp"
                  name="pfp"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white text-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </motion.div>

            {/* Performance Details Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Performance Details</h2>
              {["performanceType", "performanceTitle", "description", "duration", "specialEquipment"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                    {formConfig.fields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
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
            </motion.div>

            {/* Supporting Material Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Supporting Material (Required)</h2>
              {["sampleLink", "additionalComments"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                    {formConfig.fields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
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
              <p className="text-sm text-black mt-4">We will review your application and contact selected performers!</p>
              <p className="text-sm text-black mt-2">For inquiries, reach us at <a href={`mailto:${formConfig.contactEmail}`} className="text-red-600 hover:underline">{formConfig.contactEmail}</a></p>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}