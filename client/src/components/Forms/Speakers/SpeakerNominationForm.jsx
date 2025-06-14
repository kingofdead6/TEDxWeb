import { useState } from "react";
import { motion } from "framer-motion";
import { API_BASE_URL } from '../../../../api.js';

// Dynamic content configuration
const formConfig = {
  title: "Speaker Nomination Form",
  subtitle: "Please fill out the form carefully. Our team spends significant effort reviewing every nomination and will contact shortlisted candidates.",
  contactEmail: "contact@tedxuniversityofalgiers.com",
  submitButton: {
    text: "Submit Your Nomination"
  },
  fields: {
    fullName: { label: "Full Name", required: true },
    email: { label: "Email Address", required: true },
    phoneNumber: { label: "Phone Number", required: true },
    occupation: { label: "Occupation/Title", required: true },
    organization: { label: "Organization/Affiliation", required: true },
    cityCountry: { label: "City & Country", required: true },
    linkedin: { label: "LinkedIn Profile or Website (Optional)", required: false },
    talkTitle: { label: "Proposed Talk Title", required: true },
    talkSummary: { label: "Brief Summary of the Talk (50-100 words)", required: true, maxWords: 100 },
    talkImportance: { label: "Why is this idea important and worth sharing? (150-250 words)", required: true, maxWords: 250 },
    priorTalk: { label: "Has the nominee given this talk before?", required: true, options: ["Yes", "No"] },
    speakerQualities: { label: "What makes the nominee a great speaker? (100-200 words)", required: true, maxWords: 200 },
    pastSpeeches: { label: "Link to past speeches, videos, or interviews (Optional)", required: false },
    additionalInfo: { label: "Any additional information that strengthens the nomination (Optional)", required: false }
  }
};

export default function SpeakerNominationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    occupation: "",
    organization: "",
    cityCountry: "",
    linkedin: "",
    talkTitle: "",
    talkSummary: "",
    talkImportance: "",
    priorTalk: "",
    priorTalkDetails: "",
    speakerQualities: "",
    pastSpeeches: "",
    additionalInfo: ""
  });
  const [formStatus, setFormStatus] = useState({ message: "", type: "" }); // For success/error messages
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

    // Validate word counts
    const wordCounts = {
      talkSummary: countWords(formData.talkSummary),
      talkImportance: countWords(formData.talkImportance),
      speakerQualities: countWords(formData.speakerQualities),
    };

    if (wordCounts.talkSummary > formConfig.fields.talkSummary.maxWords) {
      setFormStatus({ message: `Talk summary exceeds ${formConfig.fields.talkSummary.maxWords} words (current: ${wordCounts.talkSummary})`, type: "error" });
      setIsSubmitting(false);
      return;
    }
    if (wordCounts.talkImportance > formConfig.fields.talkImportance.maxWords) {
      setFormStatus({ message: `Talk importance exceeds ${formConfig.fields.talkImportance.maxWords} words (current: ${wordCounts.talkImportance})`, type: "error" });
      setIsSubmitting(false);
      return;
    }
    if (wordCounts.speakerQualities > formConfig.fields.speakerQualities.maxWords) {
      setFormStatus({ message: `Speaker qualities exceeds ${formConfig.fields.speakerQualities.maxWords} words (current: ${wordCounts.speakerQualities})`, type: "error" });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/speakers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormStatus({ message: "Nomination submitted successfully!", type: "success" });
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          occupation: "",
          organization: "",
          cityCountry: "",
          linkedin: "",
          talkTitle: "",
          talkSummary: "",
          talkImportance: "",
          priorTalk: "",
          priorTalkDetails: "",
          speakerQualities: "",
          pastSpeeches: "",
          additionalInfo: ""
        });
      } else {
        setFormStatus({ message: result.error || "Failed to submit nomination. Please try again.", type: "error" });
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 -mt-15 mb-20">
      <div className="justify-center bg-white text-center relative px-4 mb-2 sm:mb-10" dir="ltr">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block mb-8 sm:mb-16 px-4 sm:px-6 py-1 sm:py-2 rounded-full bg-[#D9D9D9] shadow-sm"
        >
          <h2 className="text-lg sm:text-xl font-semibold text-[#DE8F5A]">Nominate a Speaker</h2>
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
          <p className="text-lg sm:text-xl text-black mb-15">
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

            {/* Speaker's Information Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Speaker's Information</h2>
              {["fullName", "email", "phoneNumber", "occupation", "organization", "cityCountry", "linkedin"].map((fieldName) => (
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
            </motion.div>

            {/* Talk Proposal Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Talk Proposal</h2>
              {["talkTitle", "talkSummary", "talkImportance"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                    {formConfig.fields[fieldName].required && <span className="text-red-500">*</span>}
                  </label>
                  {fieldName === "talkSummary" || fieldName === "talkImportance" ? (
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
                  ) : (
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
                  )}
                  {(fieldName === "talkSummary" || fieldName === "talkImportance" || fieldName === "speakerQualities") && (
                    <p className="text-sm text-gray-600 mt-1">
                      {countWords(formData[fieldName])}/{formConfig.fields[fieldName].maxWords} words
                    </p>
                  )}
                </div>
              ))}
              <div className="mb-4">
                <label htmlFor="priorTalk" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.priorTalk.label}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="priorTalk"
                  name="priorTalk"
                  value={formData.priorTalk}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an option</option>
                  {formConfig.fields.priorTalk.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {formData.priorTalk === "Yes" && (
                  <input
                    type="text"
                    name="priorTalkDetails"
                    value={formData.priorTalkDetails}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent mt-2"
                    placeholder="Provide details & links to past talks"
                  />
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="speakerQualities" className="block text-sm font-bold text-black mb-1">
                  {formConfig.fields.speakerQualities.label}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="speakerQualities"
                  name="speakerQualities"
                  value={formData.speakerQualities}
                  onChange={handleChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                  rows="4"
                  placeholder={formConfig.fields.speakerQualities.label}
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  {countWords(formData.speakerQualities)}/200 words
                </p>
              </div>
            </motion.div>

            {/* Supporting Material Section */}
            <motion.div variants={itemVariants}>
              <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">Supporting Material (Optional but Recommended)</h2>
              {["pastSpeeches", "additionalInfo"].map((fieldName) => (
                <div key={fieldName} className="mb-4">
                  <label htmlFor={fieldName} className="block text-sm font-bold text-black mb-1">
                    {formConfig.fields[fieldName].label}
                  </label>
                  <input
                    type="text"
                    id={fieldName}
                    name={fieldName}
                    value={formData[fieldName]}
                    onChange={handleChange}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded bg-white placeholder-[#8D8D8D] font-bold focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-transparent"
                    placeholder={formConfig.fields[fieldName].label}
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
              <p className="text-sm text-black mt-4">We will review the nomination and contact shortlisted candidates!</p>
              <p className="text-sm text-black mt-2">For inquiries, reach us at <a href={`mailto:${formConfig.contactEmail}`} className="text-red-600 hover:underline">{formConfig.contactEmail}</a></p>
            </motion.div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}