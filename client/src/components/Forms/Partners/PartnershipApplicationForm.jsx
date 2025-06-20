import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from '../../../../api.js';

// Dynamic content configuration
const formConfig = {
  title: "Partnership Application Form",
  subtitle: "Please complete this form with as much detail as possible. Our team will review applications and select partners based on alignment with our vision and values.",
  contactEmail: "contact@tedxuoalgiers.com",
  submitButton: {
    text: "Submit Your Application"
  },
  fields: {
    organizationName: { label: "Organization Name", required: true },
    contactPerson: { label: "Contact Person’s Full Name", required: true },
    contactEmail: { label: "Contact Email", required: true },
    contactPhone: { label: "Contact Phone Number", required: true },
    websiteLinks: { label: "Organization’s Website or Social Media Links", required: true },
    cityCountry: { label: "City & Country", required: true },
    orgType: { 
      label: "Type of Organization", 
      required: true, 
      options: ["Corporation", "NGO", "Government Entity", "Educational Institution", "Startup", "Other"] 
    },
    whyPartner: { label: "Why do you want to partner with us? (100-200 words)", required: true, maxWords: 200 },
    supportType: { 
      label: "How would you like to support us?", 
      required: true, 
      options: ["Financial Sponsorship", "In-Kind Sponsorship", "Media Partnership", "Speaker Support", "Other"] 
    },
    specificEvents: { label: "Are there specific events or initiatives you are interested in supporting?", required: true },
    partnershipBenefits: { label: "What benefits or outcomes do you hope to achieve from this partnership?", required: true },
    companyProfile: { label: "Upload Company Profile or Partnership Proposal (Optional)", required: false },
    additionalComments: { label: "Additional comments or requests (Optional)", required: false }
  }
};

export default function PartnershipApplicationForm() {
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    websiteLinks: "",
    cityCountry: "",
    orgType: "",
    otherOrgType: "",
    whyPartner: "",
    supportType: [],
    otherSupportType: "",
    specificEvents: "",
    partnershipBenefits: "",
    companyProfile: null,
    additionalComments: ""
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

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const newSupportType = checked
        ? [...prev.supportType, value]
        : prev.supportType.filter((type) => type !== value);
      return { ...prev, supportType: newSupportType };
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
      if (field === "supportType" && formData.supportType.length === 0) {
        setFormStatus({ message: "Please select at least one support type", type: "error" });
        setIsSubmitting(false);
        return;
      }
      if (field !== "supportType" && !formData[field]) {
        setFormStatus({ message: `${formConfig.fields[field].label} is required`, type: "error" });
        setIsSubmitting(false);
        return;
      }
    }

    // Validate whyPartner word count (100-200 words)
    const whyPartnerWords = countWords(formData.whyPartner);
    if (whyPartnerWords < 100 || whyPartnerWords > 200) {
      setFormStatus({
        message: `Why do you want to partner with us? must be between 100 and 200 words (current: ${whyPartnerWords})`,
        type: "error"
      });
      setIsSubmitting(false);
      return;
    }

    // Prepare FormData
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "supportType") {
        formDataToSend.append(key, JSON.stringify(formData[key])); // Stringify array
      } else if (key === "companyProfile" && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else if (formData[key] !== null && formData[key] !== undefined) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Log form data for debugging
    console.log('Submitting form data:', Object.fromEntries(formDataToSend));

    try {
      const response = await fetch(`${API_BASE_URL}/partners`, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus({ message: "Partnership application submitted successfully!", type: "success" });
        setFormData({
          organizationName: "",
          contactPerson: "",
          contactEmail: "",
          contactPhone: "",
          websiteLinks: "",
          cityCountry: "",
          orgType: "",
          otherOrgType: "",
          whyPartner: "",
          supportType: [],
          otherSupportType: "",
          specificEvents: "",
          partnershipBenefits: "",
          companyProfile: null,
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 mt-0 mb-20 ">  
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
          <p className="text-lg sm:text-xl text-black mb-15">
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

            {/* Organization’s Information Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Your Organization’s Information</h2>
              {["organizationName", "contactPerson", "contactEmail", "contactPhone", "websiteLinks", "cityCountry"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                    {formConfig.fields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={fieldName === 'contactEmail' ? 'email' : fieldName === 'contactPhone' ? 'tel' : 'text'}
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

            {/* Partnership Details Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Partnership Details</h2>
              <div className="mb-4">
                <label htmlFor="orgType" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.orgType.label}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="orgType"
                  name="orgType"
                  value={formData.orgType}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {formConfig.fields.orgType.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formData.orgType === "Other" && (
                  <input
                    type="text"
                    name="otherOrgType"
                    value={formData.otherOrgType}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Please specify"
                  />
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="whyPartner" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.whyPartner.label}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="whyPartner"
                  name="whyPartner"
                  value={formData.whyPartner}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  rows="4"
                  placeholder={formConfig.fields.whyPartner.label}
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  {countWords(formData.whyPartner)}/200 words
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.supportType.label}
                  <span className="text-red-500">*</span>
                </label>
                {formConfig.fields.supportType.options.map((type) => (
                  <div key={type} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`support-${type}`}
                      name="supportType"
                      value={type}
                      checked={formData.supportType.includes(type)}
                      onChange={handleCheckboxChange}
                      className="mr-2 focus:outline-none rounded-full accent-red-500 cursor-pointer"
                    />
                    <label htmlFor={`support-${type}`} className="text-black">
                      {type}
                    </label>
                  </div>
                ))}
                {formData.supportType.includes("Other") && (
                  <input
                    type="text"
                    name="otherSupportType"
                    value={formData.otherSupportType}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Please specify"
                  />
                )}
              </div>
              {["specificEvents", "partnershipBenefits"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                    {formConfig.fields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    rows="4"
                    placeholder={formConfig.fields[fieldName].label}
                    required={formConfig.fields[fieldName].required}
                  />
                </div>
              ))}
            </motion.div>

            {/* Supporting Documents Section */}
            <motion.div variants={itemVariants}>
             
              <div className="mb-4">
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
              </div>
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
              <p className="text-sm text-black mt-4">Our team will review your application and contact you for further discussions!</p>
              <p className="text-sm text-black mt-2">For inquiries, reach us at <a href={`mailto:${formConfig.contactEmail}`} className="text-red-600 hover:underline">{formConfig.contactEmail}</a></p>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}