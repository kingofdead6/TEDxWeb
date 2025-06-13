import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../api';
import toast, { Toaster } from 'react-hot-toast';

function AddParticipants() {
  const [activeForm, setActiveForm] = useState('speaker');
  const [speakerData, setSpeakerData] = useState({
    fullName: '', email: '', phoneNumber: '', occupation: '', organization: '', cityCountry: '',
    linkedin: '', instagram: '', website: '', talkTitle: '', talkSummary: '', talkImportance: '',
    priorTalk: 'no', priorTalkDetails: '', speakerQualities: '', pastSpeeches: '', additionalInfo: '',
    pfp: null, isVisibleOnMainPage: false,
  });
  const [partnerData, setPartnerData] = useState({
    organizationName: '', contactPerson: '', contactEmail: '', contactPhone: '', websiteLinks: '',
    cityCountry: '', orgType: '', otherOrgType: '', whyPartner: '', supportType: [],
    otherSupportType: '', specificEvents: '', partnershipBenefits: '', companyProfile: null,
    additionalComments: '', isVisibleOnMainPage: false,
  });
  const [volunteerData, setVolunteerData] = useState({
    fullName: '', email: '', phoneNumber: '', age: '', cityCountry: '', linkedin: '',
    commitment: '', priorExperience: 'no', priorExperienceDetails: '', roles: [],
    otherRole: '', whyVolunteer: '', whatAdd: '', additionalComments: '',
  });
  const [loading, setLoading] = useState({ speaker: false, partner: false, volunteer: false });

  const handleFileChange = (e, type, field) => {
    const file = e.target.files[0];
    if (type === 'speaker') {
      setSpeakerData({ ...speakerData, [field]: file });
    } else if (type === 'partner') {
      setPartnerData({ ...partnerData, [field]: file });
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading({ ...loading, [type]: true });
    const formData = new FormData();
    let data, endpoint;

    if (type === 'speaker') {
      data = speakerData;
      endpoint = '/speakers';
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'pfp' && value) {
          formData.append('pfp', value);
        } else if (key === 'isVisibleOnMainPage') {
          formData.append(key, value.toString());
        } else if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });
    } else if (type === 'partner') {
      data = { ...partnerData, supportType: JSON.stringify(partnerData.supportType) };
      endpoint = '/partners';
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'companyProfile' && value) {
          formData.append('companyProfile', value);
        } else if (key === 'isVisibleOnMainPage') {
          formData.append(key, value.toString());
        } else if (value !== null && value !== '' && key !== 'supportType') {
          formData.append(key, value);
        }
      });
      if (partnerData.supportType.length > 0) {
        formData.append('supportType', JSON.stringify(partnerData.supportType));
      }
    } else if (type === 'volunteer') {
      data = { ...volunteerData, roles: JSON.stringify(volunteerData.roles) };
      endpoint = '/volunteers';
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });
    }

    try {
      await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1

)} added successfully`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
      // Reset form
      if (type === 'speaker') {
        setSpeakerData({
          fullName: '', email: '', phoneNumber: '', occupation: '', organization: '', cityCountry: '',
          linkedin: '', instagram: '', website: '', talkTitle: '', talkSummary: '', talkImportance: '',
          priorTalk: 'no', priorTalkDetails: '', speakerQualities: '', pastSpeeches: '', additionalInfo: '',
          pfp: null, isVisibleOnMainPage: false,
        });
      } else if (type === 'partner') {
        setPartnerData({
          organizationName: '', contactPerson: '', contactEmail: '', contactPhone: '', websiteLinks: '',
          cityCountry: '', orgType: '', otherOrgType: '', whyPartner: '', supportType: [],
          otherSupportType: '', specificEvents: '', partnershipBenefits: '', companyProfile: null,
          additionalComments: '', isVisibleOnMainPage: false,
        });
      } else {
        setVolunteerData({
          fullName: '', email: '', phoneNumber: '', age: '', cityCountry: '', linkedin: '',
          commitment: '', priorExperience: 'no', priorExperienceDetails: '', roles: [],
          otherRole: '', whyVolunteer: '', whatAdd: '', additionalComments: '',
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to add ${type}`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } finally {
      setLoading({ ...loading, [type]: false });
    }
  };

  const inputClass = 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white hover:border-gray-400';
  const textareaClass = 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white hover:border-gray-400 resize-vertical min-h-[100px]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-2';
  const buttonClass = 'px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 flex items-center justify-center cursor-pointer';
  const fileInputClass = 'w-full p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-100 file:text-red-600 file:cursor-pointer file:hover:bg-red-200 transition duration-200';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 pt-20 pb-12 px-4 sm:px-6">
      <Toaster />
      <motion.div
        className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-4xl font-extrabold text-red-600 mb-8 text-center">Add Participants</h2>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {['Speaker', 'Partner', 'Volunteer'].map((type) => (
            <motion.button
              key={type}
              onClick={() => setActiveForm(type.toLowerCase())}
              className={`cursor-pointer px-6 py-3 rounded-lg font-semibold text-lg transition duration-200 ${
                activeForm === type.toLowerCase()
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={`Switch to ${type} form`}
            >
              Add {type}
            </motion.button>
          ))}
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          {activeForm === 'speaker' && (
            <motion.form
              key="speaker"
              onSubmit={(e) => handleSubmit(e, 'speaker')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add Speaker</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={speakerData.fullName}
                    onChange={(e) => setSpeakerData({ ...speakerData, fullName: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={speakerData.email}
                    onChange={(e) => setSpeakerData({ ...speakerData, email: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={speakerData.phoneNumber}
                    onChange={(e) => setSpeakerData({ ...speakerData, phoneNumber: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Occupation</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={speakerData.occupation}
                    onChange={(e) => setSpeakerData({ ...speakerData, occupation: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Organization</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={speakerData.organization}
                    onChange={(e) => setSpeakerData({ ...speakerData, organization: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>City/Country</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={speakerData.cityCountry}
                    onChange={(e) => setSpeakerData({ ...speakerData, cityCountry: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={speakerData.linkedin}
                    onChange={(e) => setSpeakerData({ ...speakerData, linkedin: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={speakerData.instagram}
                    onChange={(e) => setSpeakerData({ ...speakerData, instagram: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Personal Website</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={speakerData.website}
                    onChange={(e) => setSpeakerData({ ...speakerData, website: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Talk Title</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={speakerData.talkTitle}
                    onChange={(e) => setSpeakerData({ ...speakerData, talkTitle: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Talk Summary</label>
                  <textarea
                    className={textareaClass}
                    value={speakerData.talkSummary}
                    onChange={(e) => setSpeakerData({ ...speakerData, talkSummary: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Talk Importance</label>
                  <textarea
                    className={textareaClass}
                    value={speakerData.talkImportance}
                    onChange={(e) => setSpeakerData({ ...speakerData, talkImportance: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Prior Talk</label>
                  <select
                    className={inputClass}
                    value={speakerData.priorTalk}
                    onChange={(e) => setSpeakerData({ ...speakerData, priorTalk: e.target.value })}
                    required
                    aria-required="true"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {speakerData.priorTalk === 'yes' && (
                  <div className="col-span-2">
                    <label className={labelClass}>Prior Talk Details</label>
                    <textarea
                      className={textareaClass}
                      value={speakerData.priorTalkDetails}
                      onChange={(e) => setSpeakerData({ ...speakerData, priorTalkDetails: e.target.value })}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <label className={labelClass}>Speaker Qualities</label>
                  <textarea
                    className={textareaClass}
                    value={speakerData.speakerQualities}
                    onChange={(e) => setSpeakerData({ ...speakerData, speakerQualities: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Past Speeches</label>
                  <textarea
                    className={textareaClass}
                    value={speakerData.pastSpeeches}
                    onChange={(e) => setSpeakerData({ ...speakerData, pastSpeeches: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Additional Info</label>
                  <textarea
                    className={textareaClass}
                    value={speakerData.additionalInfo}
                    onChange={(e) => setSpeakerData({ ...speakerData, additionalInfo: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={fileInputClass}
                    onChange={(e) => handleFileChange(e, 'speaker', 'pfp')}
                  />
                </div>
                <div className="flex items-center">
                  <label className={labelClass}>Show on Main Page</label>
                  <input
                    type="checkbox"
                    checked={speakerData.isVisibleOnMainPage}
                    onChange={(e) => setSpeakerData({ ...speakerData, isVisibleOnMainPage: e.target.checked })}
                    className="h-5 w-5 text-red-600 rounded focus:ring-red-500 ml-2 accent-red-500 cursor-pointer"
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                className={buttonClass}
                disabled={loading.speaker}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading.speaker ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Speaker'
                )}
              </motion.button>
            </motion.form>
          )}

          {activeForm === 'partner' && (
            <motion.form
              key="partner"
              onSubmit={(e) => handleSubmit(e, 'partner')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add Partner</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Organization Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={partnerData.organizationName}
                    onChange={(e) => setPartnerData({ ...partnerData, organizationName: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Person</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={partnerData.contactPerson}
                    onChange={(e) => setPartnerData({ ...partnerData, contactPerson: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={partnerData.contactEmail}
                    onChange={(e) => setPartnerData({ ...partnerData, contactEmail: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Phone</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={partnerData.contactPhone}
                    onChange={(e) => setPartnerData({ ...partnerData, contactPhone: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Website Links</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={partnerData.websiteLinks}
                    onChange={(e) => setPartnerData({ ...partnerData, websiteLinks: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>City/Country</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={partnerData.cityCountry}
                    onChange={(e) => setPartnerData({ ...partnerData, cityCountry: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Organization Type</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={partnerData.orgType}
                    onChange={(e) => setPartnerData({ ...partnerData, orgType: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Other Organization Type</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={partnerData.otherOrgType}
                    onChange={(e) => setPartnerData({ ...partnerData, otherOrgType: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Why Partner</label>
                  <textarea
                    className={textareaClass}
                    value={partnerData.whyPartner}
                    onChange={(e) => setPartnerData({ ...partnerData, whyPartner: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Support Type</label>
                  <div className="flex flex-wrap gap-4">
                    {['Financial', 'In-Kind', 'Media', 'Other'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={type}
                          checked={partnerData.supportType.includes(type)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...partnerData.supportType, type]
                              : partnerData.supportType.filter((t) => t !== type);
                            setPartnerData({ ...partnerData, supportType: updated });
                          }}
                          className="h-5 w-5 text-red-600 rounded focus:ring-red-500 accent-red-500 cursor-pointer"
                        />
                        <span className="text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {partnerData.supportType.includes('Other') && (
                  <div className="col-span-2">
                    <label className={labelClass}>Other Support Type</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={partnerData.otherSupportType}
                      onChange={(e) => setPartnerData({ ...partnerData, otherSupportType: e.target.value })}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <label className={labelClass}>Specific Events</label>
                  <textarea
                    className={textareaClass}
                    value={partnerData.specificEvents}
                    onChange={(e) => setPartnerData({ ...partnerData, specificEvents: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Partnership Benefits</label>
                  <textarea
                    className={textareaClass}
                    value={partnerData.partnershipBenefits}
                    onChange={(e) => setPartnerData({ ...partnerData, partnershipBenefits: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Company Profile</label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    className={fileInputClass}
                    onChange={(e) => handleFileChange(e, 'partner', 'companyProfile')}
                  />
                </div>
                <div className="flex items-center">
                  <label className={labelClass}>Show on Main Page</label>
                  <input
                    type="checkbox"
                    checked={partnerData.isVisibleOnMainPage}
                    onChange={(e) => setPartnerData({ ...partnerData, isVisibleOnMainPage: e.target.checked })}
                    className="h-5 w-5 text-red-600 rounded focus:ring-red-500 ml-2 accent-red-500 cursor-pointer"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Additional Comments</label>
                  <textarea
                    className={textareaClass}
                    value={partnerData.additionalComments}
                    onChange={(e) => setPartnerData({ ...partnerData, additionalComments: e.target.value })}
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                className={buttonClass}
                disabled={loading.partner}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading.partner ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Partner'
                )}
              </motion.button>
            </motion.form>
          )}

          {activeForm === 'volunteer' && (
            <motion.form
              key="volunteer"
              onSubmit={(e) => handleSubmit(e, 'volunteer')}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Add Volunteer</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={volunteerData.fullName}
                    onChange={(e) => setVolunteerData({ ...volunteerData, fullName: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={volunteerData.email}
                    onChange={(e) => setVolunteerData({ ...volunteerData, email: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={volunteerData.phoneNumber}
                    onChange={(e) => setVolunteerData({ ...volunteerData, phoneNumber: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Age</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={volunteerData.age}
                    onChange={(e) => setVolunteerData({ ...volunteerData, age: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>City/Country</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={volunteerData.cityCountry}
                    onChange={(e) => setVolunteerData({ ...volunteerData, cityCountry: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={volunteerData.linkedin}
                    onChange={(e) => setVolunteerData({ ...volunteerData, linkedin: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Commitment</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={volunteerData.commitment}
                    onChange={(e) => setVolunteerData({ ...volunteerData, commitment: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Prior Experience</label>
                  <select
                    className={inputClass}
                    value={volunteerData.priorExperience}
                    onChange={(e) => setVolunteerData({ ...volunteerData, priorExperience: e.target.value })}
                    required
                    aria-required="true"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                {volunteerData.priorExperience === 'yes' && (
                  <div className="col-span-2">
                    <label className={labelClass}>Prior Experience Details</label>
                    <textarea
                      className={textareaClass}
                      value={volunteerData.priorExperienceDetails}
                      onChange={(e) => setVolunteerData({ ...volunteerData, priorExperienceDetails: e.target.value })}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <label className={labelClass}>Roles</label>
                  <div className="flex flex-wrap gap-4">
                    {['Event Support', 'Logistics', 'Media', 'Other'].map((role) => (
                      <label key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={role}
                          checked={volunteerData.roles.includes(role)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...volunteerData.roles, role]
                              : volunteerData.roles.filter((r) => r !== role);
                            setVolunteerData({ ...volunteerData, roles: updated });
                          }}
                          className="h-5 w-5 text-red-600 rounded focus:ring-red-500 accent-red-500 cursor-pointer"
                        />
                        <span className="text-gray-700">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {volunteerData.roles.includes('Other') && (
                  <div className="col-span-2">
                    <label className={labelClass}>Other Role</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={volunteerData.otherRole}
                      onChange={(e) => setVolunteerData({ ...volunteerData, otherRole: e.target.value })}
                    />
                  </div>
                )}
                <div className="col-span-2">
                  <label className={labelClass}>Why Volunteer</label>
                  <textarea
                    className={textareaClass}
                    value={volunteerData.whyVolunteer}
                    onChange={(e) => setVolunteerData({ ...volunteerData, whyVolunteer: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>What You Add</label>
                  <textarea
                    className={textareaClass}
                    value={volunteerData.whatAdd}
                    onChange={(e) => setVolunteerData({ ...volunteerData, whatAdd: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Additional Comments</label>
                  <textarea
                    className={textareaClass}
                    value={volunteerData.additionalComments}
                    onChange={(e) => setVolunteerData({ ...volunteerData, additionalComments: e.target.value })}
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                className={buttonClass}
                disabled={loading.volunteer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading.volunteer ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Volunteer'
                )}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AddParticipants;