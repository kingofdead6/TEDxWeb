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
    pfp: null, isVisibleOnMainPage: false, addedByAdmin: false,
  });
  const [partnerData, setPartnerData] = useState({
    organizationName: '', contactPerson: '', contactEmail: '', contactPhone: '', websiteLinks: '',
    cityCountry: '', orgType: '', otherOrgType: '', whyPartner: '', supportType: [],
    otherSupportType: '', specificEvents: '', partnershipBenefits: '', companyProfile: null,
    additionalComments: '', isVisibleOnMainPage: false, addedByAdmin: false,
  });
  const [teamMemberData, setTeamMemberData] = useState({
    fullName: '', role: '', description: '', linkedin: '', instagram: '', youtube: '', website: '',
    pfp: null, isVisibleOnMainPage: false,
  });
  const [loading, setLoading] = useState({ speaker: false, partner: false, teamMember: false });

  const handleFileChange = (e, type, field) => {
    const file = e.target.files[0];
    if (type === 'speaker') {
      setSpeakerData({ ...speakerData, [field]: file });
    } else if (type === 'partner') {
      setPartnerData({ ...partnerData, [field]: file });
    } else if (type === 'teamMember') {
      setTeamMemberData({ ...teamMemberData, [field]: file });
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading({ ...loading, [type]: true });
    const formData = new FormData();
    let data, endpoint;

    if (type === 'speaker') {
      data = { ...speakerData, addedByAdmin: true }; // Always set to true for speakers
      endpoint = '/speakers';
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'pfp' && value) {
          formData.append('pfp', value);
        } else if (key === 'isVisibleOnMainPage' || key === 'addedByAdmin') {
          formData.append(key, value.toString());
        } else if (value !== null && value !== '') {
          formData.append(key, value);
        }
      });
    } else if (type === 'partner') {
      data = { ...partnerData, addedByAdmin: true }; // Always set to true for partners
      endpoint = '/partners';
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'companyProfile' && value) {
          formData.append('companyProfile', value);
        } else if (key === 'isVisibleOnMainPage' || key === 'addedByAdmin') {
          formData.append(key, value.toString());
        } else if (value !== null && value !== '' && key !== 'supportType') {
          formData.append(key, value);
        }
      });
      if (partnerData.supportType.length > 0) {
        formData.append('supportType', JSON.stringify(partnerData.supportType));
      }
    } else if (type === 'teamMember') {
      data = teamMemberData;
      endpoint = '/team-members';
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'pfp' && value) {
          formData.append('pfp', value);
        } else if (key === 'isVisibleOnMainPage') {
          formData.append(key, value.toString());
        } else if (value !== null && value !== '') {
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
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
      if (type === 'speaker') {
        setSpeakerData({
          fullName: '', email: '', phoneNumber: '', occupation: '', organization: '', cityCountry: '',
          linkedin: '', instagram: '', website: '', talkTitle: '', talkSummary: '', talkImportance: '',
          priorTalk: 'no', priorTalkDetails: '', speakerQualities: '', pastSpeeches: '', additionalInfo: '',
          pfp: null, isVisibleOnMainPage: false, addedByAdmin: true
        });
      } else if (type === 'partner') {
        setPartnerData({
          organizationName: '', contactPerson: '', contactEmail: '', contactPhone: '', websiteLinks: '',
          cityCountry: '', orgType: '', otherOrgType: '', whyPartner: '', supportType: [],
          otherSupportType: '', specificEvents: '', partnershipBenefits: '', companyProfile: null,
          additionalComments: '', isVisibleOnMainPage: false, addedByAdmin: true
        });
      } else if (type === 'teamMember') {
        setTeamMemberData({
          fullName: '', role: '', description: '', linkedin: '', instagram: '', youtube: '', website: '',
          pfp: null, isVisibleOnMainPage: false,
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

  const inputClass = 'w-full p-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white hover:border-gray-400';
  const textareaClass = 'w-full p-4 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white hover:border-gray-400 resize-vertical min-h-[120px]';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-2';
  const buttonClass = 'w-full sm:w-auto px-6 py-4 text-base bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 flex items-center justify-center cursor-pointer min-h-[48px]';
  const fileInputClass = 'w-full p-4 text-base border border-gray-300 rounded-lg bg-white hover:border-gray-400 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-100 file:text-red-600 file:cursor-pointer file:hover:bg-red-200 transition duration-200';

  return (
    <div className="min-h-screen bg-gradient-to-b pt-16 pb-8 px-4">
      <Toaster />
      <motion.div
        className="container mx-auto max-w-3xl bg-white rounded-2xl shadow-xl shadow-red-500 p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="text-sm text-gray-500 mb-4 text-center">Date and Time: Saturday, June 14, 2025, 05:08 PM CET</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-red-600 mb-6 text-center">Add People</h2>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
          {['Speaker', 'Partner', 'Team Member'].map((type) => (
            <motion.button
              key={type}
              onClick={() => setActiveForm(type.toLowerCase().replace(' ', ''))}
              className={`w-full sm:w-auto cursor-pointer px-4 py-3 rounded-lg font-semibold text-base transition duration-200 ${
                activeForm === type.toLowerCase().replace(' ', '')
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Add Speaker</h3>
              <div className="grid grid-cols-1 gap-4">
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
                <div>
                  <label className={labelClass}>Talk Summary</label>
                  <textarea
                    className={textareaClass}
                    value={speakerData.talkSummary}
                    onChange={(e) => setSpeakerData({ ...speakerData, talkSummary: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
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
                  <div>
                    <label className={labelClass}>Prior Talk Details</label>
                    <textarea
                      className={textareaClass}
                      value={speakerData.priorTalkDetails}
                      onChange={(e) => setSpeakerData({ ...speakerData, priorTalkDetails: e.target.value })}
                    />
                  </div>
                )}
                <div>
                  <label className={labelClass}>Speaker Qualities</label>
                  <textarea
                    className={textareaClass}
                    value={speakerData.speakerQualities}
                    onChange={(e) => setSpeakerData({ ...speakerData, speakerQualities: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Past Speeches</label>
                  <textarea
                    className={textareaClass}
                    value={speakerData.pastSpeeches}
                    onChange={(e) => setSpeakerData({ ...speakerData, pastSpeeches: e.target.value })}
                  />
                </div>
                <div>
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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Add Partner</h3>
              <div className="grid grid-cols-1 gap-4">
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
                <div>
                  <label className={labelClass}>Why Partner</label>
                  <textarea
                    className={textareaClass}
                    value={partnerData.whyPartner}
                    onChange={(e) => setPartnerData({ ...partnerData, whyPartner: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Support Type</label>
                  <div className="flex flex-col gap-2">
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
                  <div>
                    <label className={labelClass}>Other Support Type</label>
                    <input
                      type="text"
                      className={inputClass}
                      value={partnerData.otherSupportType}
                      onChange={(e) => setPartnerData({ ...partnerData, otherSupportType: e.target.value })}
                    />
                  </div>
                )}
                <div>
                  <label className={labelClass}>Specific Events</label>
                  <textarea
                    className={textareaClass}
                    value={partnerData.specificEvents}
                    onChange={(e) => setPartnerData({ ...partnerData, specificEvents: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
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
                <div>
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
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
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

          {activeForm === 'teammember' && (
            <motion.form
              key="teamMember"
              onSubmit={(e) => handleSubmit(e, 'teamMember')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Add Team Member</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={teamMemberData.fullName}
                    onChange={(e) => setTeamMemberData({ ...teamMemberData, fullName: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Role</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={teamMemberData.role}
                    onChange={(e) => setTeamMemberData({ ...teamMemberData, role: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    className={textareaClass}
                    value={teamMemberData.description}
                    onChange={(e) => setTeamMemberData({ ...teamMemberData, description: e.target.value })}
                    required
                    aria-required="true"
                  />
                </div>
                <div>
                  <label className={labelClass}>LinkedIn</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={teamMemberData.linkedin}
                    onChange={(e) => setTeamMemberData({ ...teamMemberData, linkedin: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Instagram</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={teamMemberData.instagram}
                    onChange={(e) => setTeamMemberData({ ...teamMemberData, instagram: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>YouTube</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={teamMemberData.youtube}
                    onChange={(e) => setTeamMemberData({ ...teamMemberData, youtube: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Personal Website</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={teamMemberData.website}
                    onChange={(e) => setTeamMemberData({ ...teamMemberData, website: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelClass}>Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    className={fileInputClass}
                    onChange={(e) => handleFileChange(e, 'teamMember', 'pfp')}
                  />
                </div>
                <div className="flex items-center">
                  <label className={labelClass}>Show on Main Page</label>
                  <input
                    type="checkbox"
                    checked={teamMemberData.isVisibleOnMainPage}
                    onChange={(e) => setTeamMemberData({ ...teamMemberData, isVisibleOnMainPage: e.target.checked })}
                    className="h-5 w-5 text-red-600 rounded focus:ring-red-500 ml-2 accent-red-500 cursor-pointer"
                  />
                </div>
              </div>
              <motion.button
                type="submit"
                className={buttonClass}
                disabled={loading.teamMember}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {loading.teamMember ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Team Member'
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