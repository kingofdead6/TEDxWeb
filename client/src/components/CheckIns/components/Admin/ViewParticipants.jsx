import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../api';
import { FiTrash2, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import defaultPfp from '../../assets/defaultpfp.jpg';

function ViewParticipants() {
  const [speakers, setSpeakers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [speakerOrgFilter, setSpeakerOrgFilter] = useState('');
  const [partnerOrgTypeFilter, setPartnerOrgTypeFilter] = useState('');
  const [partnerSupportTypeFilter, setPartnerSupportTypeFilter] = useState([]);
  const [volunteerRoleFilter, setVolunteerRoleFilter] = useState([]);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        }
      } catch (err) {
        console.error('Fetch user error:', err);
      }
    };
    fetchUser();
  }, []);

  // Fetch participants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speakersRes, partnersRes, volunteersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/speakers`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${API_BASE_URL}/partners`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${API_BASE_URL}/volunteers`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);
        setSpeakers(speakersRes.data);
        setPartners(partnersRes.data);
        setVolunteers(volunteersRes.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch participants');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle delete
  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      await axios.delete(`${API_BASE_URL}/${type}s/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (type === 'speaker') setSpeakers(speakers.filter((s) => s.id !== id));
      else if (type === 'partner') setPartners(partners.filter((p) => p.id !== id));
      else setVolunteers(volunteers.filter((v) => v.id !== id));
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to delete ${type}`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  // Handle visibility toggle
  const handleVisibilityToggle = async (id, type, currentVisibility) => {
    try {
      const endpoint = type === 'speaker' ? `/speakers/${id}/visibility` : `/partners/${id}/visibility`;
      const res = await axios.patch(
        `${API_BASE_URL}${endpoint}`,
        { isVisibleOnMainPage: !currentVisibility },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (type === 'speaker') {
        setSpeakers(speakers.map((s) => (s.id === id ? { ...s, isVisibleOnMainPage: res.data.speaker.isVisibleOnMainPage } : s)));
      } else {
        setPartners(partners.map((p) => (p.id === id ? { ...p, isVisibleOnMainPage: res.data.partner.isVisibleOnMainPage } : p)));
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} visibility updated`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to update ${type} visibility`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  // Filter participants
  const filteredSpeakers = speakers.filter(
    (s) =>
      (typeFilter === 'all' || typeFilter === 'speaker') &&
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (speakerOrgFilter === '' || s.organization.toLowerCase().includes(speakerOrgFilter.toLowerCase()))
  );

  const filteredPartners = partners.filter(
    (p) =>
      (typeFilter === 'all' || typeFilter === 'partner') &&
      p.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (partnerOrgTypeFilter === '' || p.orgType.toLowerCase().includes(partnerOrgTypeFilter.toLowerCase())) &&
      (partnerSupportTypeFilter.length === 0 || partnerSupportTypeFilter.every((type) => p.supportType.includes(type)))
  );

  const filteredVolunteers = volunteers.filter(
    (v) =>
      (typeFilter === 'all' || typeFilter === 'volunteer') &&
      v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (volunteerRoleFilter.length === 0 || volunteerRoleFilter.every((role) => v.roles.includes(role)))
  );

  const uniqueSpeakerOrgs = [...new Set(speakers.map((s) => s.organization))].sort();
  const uniquePartnerOrgTypes = [...new Set(partners.map((p) => p.orgType))].sort();
  const uniquePartnerSupportTypes = [...new Set(partners.flatMap((p) => p.supportType))].sort();
  const uniqueVolunteerRoles = [...new Set(volunteers.flatMap((v) => v.roles))].sort();

  // Helper function to check if participant has a custom PFP
  const hasCustomPfp = (participant, type) => {
    if (type === 'speaker') return participant.pfp && participant.pfp !== defaultPfp;
    if (type === 'partner') return participant.companyProfile && participant.companyProfile !== defaultPfp;
    return false;
  };

  return (
    <div className="min-h-screen text-gray-900 pt-20 pb-12 px-4 sm:px-6">
      <Toaster />
      <motion.div
        className="container mx-auto max-w-7xl bg-white rounded-2xl shadow-sm p-6 sm:p-8 hover:shadow-xl shadow-red-600 transition duration-300"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-4xl font-extrabold text-red-600 mb-8">Event Participants</h2>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
            <input
              type="text"
              placeholder="Enter name..."
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Participant Type</label>
            <select
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="speaker">Speakers</option>
              <option value="partner">Partners</option>
              <option value="volunteer">Volunteers</option>
            </select>
          </div>
          {typeFilter === 'speaker' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <select
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                value={speakerOrgFilter}
                onChange={(e) => setSpeakerOrgFilter(e.target.value)}
              >
                <option value="">All</option>
                {uniqueSpeakerOrgs.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </select>
            </div>
          )}
          {typeFilter === 'partner' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                <select
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  value={partnerOrgTypeFilter}
                  onChange={(e) => setPartnerOrgTypeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {uniquePartnerOrgTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Type</label>
                <select
                  multiple
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  value={partnerSupportTypeFilter}
                  onChange={(e) =>
                    setPartnerSupportTypeFilter(Array.from(e.target.selectedOptions, (option) => option.value))
                  }
                >
                  {uniquePartnerSupportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          {typeFilter === 'volunteer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
              <select
                multiple
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                value={volunteerRoleFilter}
                onChange={(e) =>
                  setVolunteerRoleFilter(Array.from(e.target.selectedOptions, (option) => option.value))
                }
              >
                {uniqueVolunteerRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-t-red-600 border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700">Loading participants...</p>
          </div>
        ) : (
          <>
            {(typeFilter === 'all' || typeFilter === 'speaker') && filteredSpeakers.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Speakers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSpeakers.map((speaker) => (
                    <motion.div
                      key={speaker.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-2xl shadow-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelectedParticipant({ type: 'speaker', data: speaker })}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={speaker.pfp || defaultPfp}
                          alt={speaker.fullName}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-red-500"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{speaker.fullName}</h4>
                          <p className="text-sm text-gray-600">{speaker.talkTitle}</p>
                          <p className="text-sm text-gray-600">{speaker.organization}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {user?.role === 'admin' && hasCustomPfp(speaker, 'speaker') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisibilityToggle(speaker.id, 'speaker', speaker.isVisibleOnMainPage);
                              }}
                              className="text-gray-600 hover:text-red-600"
                              aria-label={speaker.isVisibleOnMainPage ? 'Hide speaker' : 'Show speaker'}
                            >
                              {speaker.isVisibleOnMainPage ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(speaker.id, 'speaker');
                            }}
                            className="text-red-600 hover:text-red-800"
                            aria-label={`Delete ${speaker.fullName}`}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {(typeFilter === 'all' || typeFilter === 'partner') && filteredPartners.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Partners</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPartners.map((partner) => (
                    <motion.div
                      key={partner.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-2xl shadow-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelectedParticipant({ type: 'partner', data: partner })}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={partner.companyProfile || defaultPfp}
                          alt={partner.organizationName}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-red-500"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{partner.organizationName}</h4>
                          <p className="text-sm text-gray-600">{partner.contactPerson}</p>
                          <p className="text-sm text-gray-600">{partner.supportType.join(', ')}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {user?.role === 'admin' && hasCustomPfp(partner, 'partner') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisibilityToggle(partner.id, 'partner', partner.isVisibleOnMainPage);
                              }}
                              className="text-gray-600 hover:text-red-600"
                              aria-label={partner.isVisibleOnMainPage ? 'Hide partner' : 'Show partner'}
                            >
                              {partner.isVisibleOnMainPage ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(partner.id, 'partner');
                            }}
                            className="text-red-600 hover:text-red-800"
                            aria-label={`Delete ${partner.organizationName}`}
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {(typeFilter === 'all' || typeFilter === 'volunteer') && filteredVolunteers.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Volunteers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVolunteers.map((volunteer) => (
                    <motion.div
                      key={volunteer.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-2xl shadow-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelectedParticipant({ type: 'volunteer', data: volunteer })}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={defaultPfp}
                          alt={volunteer.fullName}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-red-500"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{volunteer.fullName}</h4>
                          <p className="text-sm text-gray-600">{volunteer.roles.join(', ')}</p>
                          <p className="text-sm text-gray-600">{volunteer.commitment}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(volunteer.id, 'volunteer');
                          }}
                          className="text-red-600 hover:text-red-800"
                          aria-label={`Delete ${volunteer.fullName}`}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {selectedParticipant && (
          <motion.div
            className="fixed inset-0 bg-[#00000073] backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedParticipant(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-1/3 bg-gray-100 p-6 flex-shrink-0 flex items-center justify-center">
                <img
                  src={
                    selectedParticipant.type === 'speaker'
                      ? selectedParticipant.data.pfp || defaultPfp
                      : selectedParticipant.type === 'partner'
                      ? selectedParticipant.data.companyProfile || defaultPfp
                      : defaultPfp
                  }
                  alt={
                    selectedParticipant.type === 'partner'
                      ? selectedParticipant.data.organizationName
                      : selectedParticipant.data.fullName
                  }
                  className="w-40 h-40 rounded-full object-cover ring-4 ring-red-500"
                />
              </div>
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-red-600">
                    {selectedParticipant.type === 'partner'
                      ? selectedParticipant.data.organizationName
                      : selectedParticipant.data.fullName}
                  </h3>
                  <button
                    onClick={() => setSelectedParticipant(null)}
                    className="text-gray-600 hover:text-red-600 cursor-pointer"
                    aria-label="Close popup"
                  >
                    <FiX className="w-7 h-7" />
                  </button>
                </div>
                <div className="space-y-3 text-gray-700">
                  {selectedParticipant.type === 'speaker' && (
                    <>
                      <p><span className="font-semibold text-red-600">Email:</span> {selectedParticipant.data.email}</p>
                      <p><span className="font-semibold text-red-600">Phone:</span> {selectedParticipant.data.phoneNumber}</p>
                      <p><span className="font-semibold text-red-600">Occupation:</span> {selectedParticipant.data.occupation}</p>
                      <p><span className="font-semibold text-red-600">Organization:</span> {selectedParticipant.data.organization}</p>
                      <p><span className="font-semibold text-red-600">City/Country:</span> {selectedParticipant.data.cityCountry}</p>
                      <p>
                        <span className="font-semibold text-red-600">LinkedIn:</span>{' '}
                        {selectedParticipant.data.linkedin ? (
                          <a
                            href={selectedParticipant.data.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedParticipant.data.linkedin}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </p>
                      <p>
                        <span className="font-semibold text-red-600">Instagram:</span>{' '}
                        {selectedParticipant.data.instagram ? (
                          <a
                            href={selectedParticipant.data.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedParticipant.data.instagram}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </p>
                      <p>
                        <span className="font-semibold text-red-600">Personal Website:</span>{' '}
                        {selectedParticipant.data.website ? (
                          <a
                            href={selectedParticipant.data.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedParticipant.data.website}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </p>
                      <p><span className="font-semibold text-red-600">Talk Title:</span> {selectedParticipant.data.talkTitle}</p>
                      <p><span className="font-semibold text-red-600">Talk Summary:</span> {selectedParticipant.data.talkSummary}</p>
                      <p><span className="font-semibold text-red-600">Talk Importance:</span> {selectedParticipant.data.talkImportance}</p>
                      <p><span className="font-semibold text-red-600">Prior Talk:</span> {selectedParticipant.data.priorTalk}</p>
                      {selectedParticipant.data.priorTalkDetails && (
                        <p><span className="font-semibold text-red-600">Prior Talk Details:</span> {selectedParticipant.data.priorTalkDetails}</p>
                      )}
                      <p><span className="font-semibold text-red-600">Speaker Qualities:</span> {selectedParticipant.data.speakerQualities}</p>
                      <p><span className="font-semibold text-red-600">Past Speeches:</span> {selectedParticipant.data.pastSpeeches || 'N/A'}</p>
                      <p><span className="font-semibold text-red-600">Additional Info:</span> {selectedParticipant.data.additionalInfo || 'N/A'}</p>
                      {user?.role === 'admin' && hasCustomPfp(selectedParticipant.data, 'speaker') && (
                        <div className="flex items-center mt-4">
                          <label className="mr-3 text-sm font-medium text-gray-700">Show on Main Page:</label>
                          <input
                            type="checkbox"
                            checked={selectedParticipant.data.isVisibleOnMainPage}
                            onChange={() =>
                              handleVisibilityToggle(
                                selectedParticipant.data.id,
                                'speaker',
                                selectedParticipant.data.isVisibleOnMainPage
                              )
                            }
                            className="h-5 w-5 text-red-600 rounded focus:ring-red-500 accent-red-500 cursor-pointer"
                          />
                        </div>
                      )}
                    </>
                  )}
                  {selectedParticipant.type === 'partner' && (
                    <>
                      <p><span className="font-semibold text-red-600">Contact Person:</span> {selectedParticipant.data.contactPerson}</p>
                      <p><span className="font-semibold text-red-600">Email:</span> {selectedParticipant.data.contactEmail}</p>
                      <p><span className="font-semibold text-red-600">Phone:</span> {selectedParticipant.data.contactPhone}</p>
                      <p>
                        <span className="font-semibold text-red-600">Website:</span>{' '}
                        <a
                          href={selectedParticipant.data.websiteLinks}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedParticipant.data.websiteLinks}
                        </a>
                      </p>
                      <p><span className="font-semibold text-red-600">City/Country:</span> {selectedParticipant.data.cityCountry}</p>
                      <p><span className="font-semibold text-red-600">Organization Type:</span> {selectedParticipant.data.orgType}</p>
                      {selectedParticipant.data.otherOrgType && (
                        <p><span className="font-semibold text-red-600">Other Org Type:</span> {selectedParticipant.data.otherOrgType}</p>
                      )}
                      <p><span className="font-semibold text-red-600">Why Partner:</span> {selectedParticipant.data.whyPartner}</p>
                      <p><span className="font-semibold text-red-600">Support Type:</span> {selectedParticipant.data.supportType.join(', ')}</p>
                      {selectedParticipant.data.otherSupportType && (
                        <p><span className="font-semibold text-red-600">Other Support Type:</span> {selectedParticipant.data.otherSupportType}</p>
                      )}
                      <p><span className="font-semibold text-red-600">Specific Events:</span> {selectedParticipant.data.specificEvents}</p>
                      <p><span className="font-semibold text-red-600">Partnership Benefits:</span> {selectedParticipant.data.partnershipBenefits}</p>
                      {selectedParticipant.data.companyProfile && (
                        <p>
                          <span className="font-semibold text-red-600">Company Profile:</span>{' '}
                          <a
                            href={selectedParticipant.data.companyProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        </p>
                      )}
                      <p><span className="font-semibold text-red-600">Additional Comments:</span> {selectedParticipant.data.additionalComments || 'N/A'}</p>
                      {user?.role === 'admin' && hasCustomPfp(selectedParticipant.data, 'partner') && (
                        <div className="flex items-center mt-4">
                          <label className="mr-3 text-sm font-medium text-gray-700">Show on Main Page:</label>
                          <input
                            type="checkbox"
                            checked={selectedParticipant.data.isVisibleOnMainPage}
                            onChange={() =>
                              handleVisibilityToggle(
                                selectedParticipant.data.id,
                                'partner',
                                selectedParticipant.data.isVisibleOnMainPage
                              )
                            }
                            className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                          />
                        </div>
                      )}
                    </>
                  )}
                  {selectedParticipant.type === 'volunteer' && (
                    <>
                      <p><span className="font-semibold text-red-600">Email:</span> {selectedParticipant.data.email}</p>
                      <p><span className="font-semibold text-red-600">Phone:</span> {selectedParticipant.data.phoneNumber || 'N/A'}</p>
                      <p><span className="font-semibold text-red-600">Age:</span> {selectedParticipant.data.age}</p>
                      <p><span className="font-semibold text-red-600">City/Country:</span> {selectedParticipant.data.cityCountry}</p>
                      <p>
                        <span className="font-semibold text-red-600">LinkedIn:</span>{' '}
                        {selectedParticipant.data.linkedin ? (
                          <a
                            href={selectedParticipant.data.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {selectedParticipant.data.linkedin}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </p>
                      <p><span className="font-semibold text-red-600">Commitment:</span> {selectedParticipant.data.commitment}</p>
                      <p><span className="font-semibold text-red-600">Prior Experience:</span> {selectedParticipant.data.priorExperience}</p>
                      {selectedParticipant.data.priorExperienceDetails && (
                        <p><span className="font-semibold text-red-600">Prior Experience Details:</span> {selectedParticipant.data.priorExperienceDetails}</p>
                      )}
                      <p><span className="font-semibold text-red-600">Roles:</span> {selectedParticipant.data.roles.join(', ')}</p>
                      {selectedParticipant.data.otherRole && (
                        <p><span className="font-semibold text-red-600">Other Role:</span> {selectedParticipant.data.otherRole}</p>
                      )}
                      <p><span className="font-semibold text-red-600">Why Volunteer:</span> {selectedParticipant.data.whyVolunteer}</p>
                      <p><span className="font-semibold text-red-600">What You Add:</span> {selectedParticipant.data.whatAdd}</p>
                      <p><span className="font-semibold text-red-600">Additional Comments:</span> {selectedParticipant.data.additionalComments || 'N/A'}</p>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ViewParticipants;