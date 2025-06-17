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
  const [teamMembers, setTeamMembers] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [press, setPress] = useState([]);
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
  const [teamMemberRoleFilter, setTeamMemberRoleFilter] = useState([]);
  const [performerTypeFilter, setPerformerTypeFilter] = useState('');
  const [pressOutletFilter, setPressOutletFilter] = useState('');
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [speakersRes, partnersRes, volunteersRes, teamMembersRes, performersRes, pressRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/speakers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/partners`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/volunteers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/team-members`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/performers`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_BASE_URL}/press`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setSpeakers(speakersRes.data);
        setPartners(partnersRes.data);
        setVolunteers(volunteersRes.data);
        setTeamMembers(teamMembersRes.data);
        setPerformers(performersRes.data);
        setPress(pressRes.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch participants');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'teamMember' ? 'team-members' : type === 'performer' ? 'performers' : `${type}s`;
      await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      switch (type) {
        case 'speaker':
          setSpeakers(speakers.filter((s) => s.id !== id));
          break;
        case 'partner':
          setPartners(partners.filter((p) => p.id !== id));
          break;
        case 'volunteer':
          setVolunteers(volunteers.filter((v) => v.id !== id));
          break;
        case 'teamMember':
          setTeamMembers(teamMembers.filter((t) => t.id !== id));
          break;
        case 'performer':
          setPerformers(performers.filter((p) => p.id !== id));
          break;
        case 'press':
          setPress(press.filter((p) => p.id !== id));
          break;
        default:
          break;
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to delete ${type}`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  const handleVisibilityToggle = async (id, type, currentVisibility) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = type === 'teamMember' ? 'team-members' : type === 'performer' ? 'performers' : `${type}s`;
      const res = await axios.patch(
        `${API_BASE_URL}/${endpoint}/${id}/visibility`,
        { isVisibleOnMainPage: !currentVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      switch (type) {
        case 'speaker':
          setSpeakers(speakers.map((s) => (s.id === id ? { ...s, isVisibleOnMainPage: res.data.speaker.isVisibleOnMainPage } : s)));
          break;
        case 'partner':
          setPartners(partners.map((p) => (p.id === id ? { ...p, isVisibleOnMainPage: res.data.partner.isVisibleOnMainPage } : p)));
          break;
        case 'teamMember':
          setTeamMembers(teamMembers.map((t) => (t.id === id ? { ...t, isVisibleOnMainPage: res.data.teamMember.isVisibleOnMainPage } : t)));
          break;
        case 'performer':
          setPerformers(performers.map((p) => (p.id === id ? { ...p, isVisibleOnMainPage: res.data.performer.isVisibleOnMainPage } : p)));
          break;
        case 'press':
          setPress(press.map((p) => (p.id === id ? { ...p, isVisibleOnMainPage: res.data.press.isVisibleOnMainPage } : p)));
          break;
        default:
          break;
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

  const filteredTeamMembers = teamMembers.filter(
    (t) =>
      (typeFilter === 'all' || typeFilter === 'teamMember') &&
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (teamMemberRoleFilter.length === 0 || teamMemberRoleFilter.includes(t.role))
  );

  const filteredPerformers = performers.filter(
    (p) =>
      (typeFilter === 'all' || typeFilter === 'performer') &&
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (performerTypeFilter === '' || p.performanceType.toLowerCase().includes(performerTypeFilter.toLowerCase()))
  );

  const filteredPress = press.filter(
    (p) =>
      (typeFilter === 'all' || typeFilter === 'press') &&
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (pressOutletFilter === '' || p.mediaOutlet.toLowerCase().includes(pressOutletFilter.toLowerCase()))
  );

  const hasCustomPfp = (participant, type) => {
    if (type === 'speaker') return participant.pfp && participant.pfp !== defaultPfp;
    if (type === 'partner') return participant.companyProfile && participant.companyProfile !== defaultPfp;
    if (type === 'teamMember' || type === 'performer') return participant.pfp && participant.pfp !== defaultPfp;
    return false;
  };

 const downloadExcel = async (type) => {
  try {
    const token = localStorage.getItem('token');
    let filteredData;
    let endpoint;

    // Map type to correct endpoint
    switch (type) {
      case 'speaker':
        filteredData = filteredSpeakers.filter(s => !s.addedByAdmin);
        endpoint = 'speakers';
        break;
      case 'partner':
        filteredData = filteredPartners.filter(p => !p.addedByAdmin);
        endpoint = 'partners';
        break;
      case 'volunteer':
        filteredData = filteredVolunteers;
        endpoint = 'volunteers';
        break;
      case 'teamMember':
        filteredData = filteredTeamMembers;
        endpoint = 'team-members';
        break;
      case 'performer':
        filteredData = filteredPerformers;
        endpoint = 'performers';
        break;
      case 'press':
        filteredData = filteredPress;
        endpoint = 'press'; 
        break;
      default:
        filteredData = [];
        endpoint = '';
    }

    const res = await axios.post(
      `${API_BASE_URL}/${endpoint}/export`,
      filteredData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        responseType: 'blob',
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}s.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} data exported successfully`, {
      style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
    });
    setShowDownloadDropdown(false);
  } catch (err) {
    toast.error(err.response?.data?.error || 'Failed to export data', {
      style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
    });
  }
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
        <h2 className="text-4xl font-extrabold text-red-600 mb-8">Event People</h2>

        {/* Filters */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Name</label>
            <input
              type="text"
              placeholder="Enter name..."
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500 min-h-[44px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Participant Type</label>
            <select
              className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 min-h-[44px]"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setSpeakerOrgFilter('');
                setPartnerOrgTypeFilter('');
                setPartnerSupportTypeFilter([]);
                setVolunteerRoleFilter([]);
                setTeamMemberRoleFilter([]);
                setPerformerTypeFilter('');
                setPressOutletFilter('');
              }}
            >
              <option value="all">All</option>
              <option value="speaker">Speakers</option>
              <option value="partner">Partners</option>
              <option value="volunteer">Volunteers</option>
              <option value="teamMember">Team Members</option>
              <option value="performer">Performers</option>
              <option value="press">Press</option>
            </select>
          </div>
          {typeFilter === 'speaker' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
              <input
                type="text"
                placeholder="Filter by organization..."
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500 min-h-[44px]"
                value={speakerOrgFilter}
                onChange={(e) => setSpeakerOrgFilter(e.target.value)}
              />
            </div>
          )}
          {typeFilter === 'partner' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Org Type</label>
                <input
                  type="text"
                  placeholder="Filter by org type..."
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500 min-h-[44px]"
                  value={partnerOrgTypeFilter}
                  onChange={(e) => setPartnerOrgTypeFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Type</label>
                <input
                  type="text"
                  placeholder="Filter by support type..."
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500 min-h-[44px]"
                  value={partnerSupportTypeFilter.join(',')}
                  onChange={(e) => setPartnerSupportTypeFilter(e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                />
              </div>
            </>
          )}
          {typeFilter === 'volunteer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                placeholder="Filter by role..."
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500 min-h-[44px]"
                value={volunteerRoleFilter.join(',')}
                onChange={(e) => setVolunteerRoleFilter(e.target.value.split(',').map(r => r.trim()).filter(r => r))}
              />
            </div>
          )}
          {typeFilter === 'teamMember' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <input
                type="text"
                placeholder="Filter by role..."
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500 min-h-[44px]"
                value={teamMemberRoleFilter.join(',')}
                onChange={(e) => setTeamMemberRoleFilter(e.target.value.split(',').map(r => r.trim()).filter(r => r))}
              />
            </div>
          )}
          {typeFilter === 'performer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Performance Type</label>
              <input
                type="text"
                placeholder="Filter by performance type..."
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500 min-h-[44px]"
                value={performerTypeFilter}
                onChange={(e) => setPerformerTypeFilter(e.target.value)}
              />
            </div>
          )}
          {typeFilter === 'press' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Media Outlet</label>
              <input
                type="text"
                placeholder="Filter by media outlet..."
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500 min-h-[44px]"
                value={pressOutletFilter}
                onChange={(e) => setPressOutletFilter(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Single Download Button with Dropdown */}
        <div className="mb-8 relative">
          <button
            onClick={() => setShowDownloadDropdown(!showDownloadDropdown)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Download Data
          </button>
          {showDownloadDropdown && (
            <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
              <button
                onClick={() => downloadExcel('speaker')}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
              >
                Download Speakers
              </button>
              <button
                onClick={() => downloadExcel('partner')}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Download Partners
              </button>
              <button
                onClick={() => downloadExcel('volunteer')}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Download Volunteers
              </button>
              <button
                onClick={() => downloadExcel('teamMember')}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Download Team Members
              </button>
              <button
                onClick={() => downloadExcel('performer')}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Download Performers
              </button>
              <button
                onClick={() => downloadExcel('press')}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
              >
                Download Press
              </button>
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
                              className="text-gray-600 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label={speaker.isVisibleOnMainPage ? 'Hide speaker' : 'Show speaker'}
                            >
                              {speaker.isVisibleOnMainPage ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(speaker.id, 'speaker');
                            }}
                            className="text-red-600 hover:text-red-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                              className="text-gray-600 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label={partner.isVisibleOnMainPage ? 'Hide partner' : 'Show partner'}
                            >
                              {partner.isVisibleOnMainPage ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(partner.id, 'partner');
                            }}
                            className="text-red-600 hover:text-red-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                          className="text-red-600 hover:text-red-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
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

            {(typeFilter === 'all' || typeFilter === 'teamMember') && filteredTeamMembers.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Team Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTeamMembers.map((teamMember) => (
                    <motion.div
                      key={teamMember.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-2xl shadow-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelectedParticipant({ type: 'teamMember', data: teamMember })}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={teamMember.pfp || defaultPfp}
                          alt={teamMember.fullName}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-red-500"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{teamMember.fullName}</h4>
                          <p className="text-sm text-gray-600">{teamMember.role}</p>
                          <p className="text-sm text-gray-600">{teamMember.description.substring(0, 50)}...</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {user?.role === 'admin' && hasCustomPfp(teamMember, 'teamMember') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisibilityToggle(teamMember.id, 'teamMember', teamMember.isVisibleOnMainPage);
                              }}
                              className="text-gray-600 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label={teamMember.isVisibleOnMainPage ? 'Hide team member' : 'Show team member'}
                            >
                              {teamMember.isVisibleOnMainPage ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(teamMember.id, 'teamMember');
                            }}
                            className="text-red-600 hover:text-red-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={`Delete ${teamMember.fullName}`}
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

            {(typeFilter === 'all' || typeFilter === 'performer') && filteredPerformers.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Performers</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPerformers.map((performer) => (
                    <motion.div
                      key={performer.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-2xl shadow-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelectedParticipant({ type: 'performer', data: performer })}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={performer.pfp || defaultPfp}
                          alt={performer.fullName}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-red-500"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{performer.fullName}</h4>
                          <p className="text-sm text-gray-600">{performer.performanceType}</p>
                          <p className="text-sm text-gray-600">{performer.performanceTitle || 'N/A'}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          {user?.role === 'admin' && hasCustomPfp(performer, 'performer') && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleVisibilityToggle(performer.id, 'performer', performer.isVisibleOnMainPage);
                              }}
                              className="text-gray-600 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
                              aria-label={performer.isVisibleOnMainPage ? 'Hide performer' : 'Show performer'}
                            >
                              {performer.isVisibleOnMainPage ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(performer.id, 'performer');
                            }}
                            className="text-red-600 hover:text-red-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={`Delete ${performer.fullName}`}
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

            {(typeFilter === 'all' || typeFilter === 'press') && filteredPress.length > 0 && (
              <>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Press</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPress.map((pressEntry) => (
                    <motion.div
                      key={pressEntry.id}
                      className="bg-white rounded-xl shadow-md p-5 hover:shadow-2xl shadow-amber-400 hover:scale-105 transition-all duration-300 cursor-pointer mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelectedParticipant({ type: 'press', data: pressEntry })}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={defaultPfp}
                          alt={pressEntry.fullName}
                          className="w-16 h-16 rounded-full object-cover ring-2 ring-red-500"
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{pressEntry.fullName}</h4>
                          <p className="text-sm text-gray-600">{pressEntry.mediaOutlet}</p>
                          <p className="text-sm text-gray-600">{pressEntry.position}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(pressEntry.id, 'press');
                            }}
                            className="text-red-600 hover:text-red-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            aria-label={`Delete ${pressEntry.fullName}`}
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
          </>
        )}

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
                        : selectedParticipant.type === 'teamMember' || selectedParticipant.type === 'performer'
                        ? selectedParticipant.data.pfp || defaultPfp
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
                      className="text-gray-600 hover:text-red-600 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
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
                            <a href={selectedParticipant.data.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedParticipant.data.linkedin}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        <p>
                          <span className="font-semibold text-red-600">Instagram:</span>{' '}
                          {selectedParticipant.data.instagram ? (
                            <a href={selectedParticipant.data.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {selectedParticipant.data.instagram}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        <p>
                          <span className="font-semibold text-red-600">Personal Website:</span>{' '}
                          {selectedParticipant.data.website ? (
                            <a href={selectedParticipant.data.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                                handleVisibilityToggle(selectedParticipant.data.id, 'speaker', selectedParticipant.data.isVisibleOnMainPage)
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
                                handleVisibilityToggle(selectedParticipant.data.id, 'partner', selectedParticipant.data.isVisibleOnMainPage)
                              }
                              className="h-5 w-5 text-red-600 rounded focus:ring-red-500 accent-red-500 cursor-pointer"
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
                    {selectedParticipant.type === 'teamMember' && (
                      <>
                        <p><span className="font-semibold text-red-600">Role:</span> {selectedParticipant.data.role}</p>
                        <p><span className="font-semibold text-red-600">Description:</span> {selectedParticipant.data.description}</p>
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
                          <span className="font-semibold text-red-600">YouTube:</span>{' '}
                          {selectedParticipant.data.youtube ? (
                            <a
                              href={selectedParticipant.data.youtube}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {selectedParticipant.data.youtube}
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
                        {user?.role === 'admin' && hasCustomPfp(selectedParticipant.data, 'teamMember') && (
                          <div className="flex items-center mt-4">
                            <label className="mr-3 text-sm font-medium text-gray-700">Show on Main Page:</label>
                            <input
                              type="checkbox"
                              checked={selectedParticipant.data.isVisibleOnMainPage}
                              onChange={() =>
                                handleVisibilityToggle(selectedParticipant.data.id, 'teamMember', selectedParticipant.data.isVisibleOnMainPage)
                              }
                              className="h-5 w-5 text-red-600 rounded focus:ring-red-500 accent-red-500 cursor-pointer"
                            />
                          </div>
                        )}
                      </>
                    )}
                    {selectedParticipant.type === 'performer' && (
                      <>
                        <p><span className="font-semibold text-red-600">Email:</span> {selectedParticipant.data.email}</p>
                        <p><span className="font-semibold text-red-600">Phone:</span> {selectedParticipant.data.phoneNumber || 'N/A'}</p>
                        <p><span className="font-semibold text-red-600">Team:</span> {selectedParticipant.data.team || 'N/A'}</p>
                        <p><span className="font-semibold text-red-600">City/Country:</span> {selectedParticipant.data.cityCountry}</p>
                        <p>
                          <span className="font-semibold text-red-600">Social Links:</span>{' '}
                          {selectedParticipant.data.socialLinks ? (
                            <a
                              href={selectedParticipant.data.socialLinks}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {selectedParticipant.data.socialLinks}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        <p><span className="font-semibold text-red-600">Performance Type:</span> {selectedParticipant.data.performanceType}</p>
                        <p><span className="font-semibold text-red-600">Performance Title:</span> {selectedParticipant.data.performanceTitle || 'N/A'}</p>
                        <p><span className="font-semibold text-red-600">Description:</span> {selectedParticipant.data.description}</p>
                        <p><span className="font-semibold text-red-600">Duration:</span> {selectedParticipant.data.duration}</p>
                        <p><span className="font-semibold text-red-600">Special Equipment:</span> {selectedParticipant.data.specialEquipment || 'N/A'}</p>
                        <p>
                          <span className="font-semibold text-red-600">Sample Link:</span>{' '}
                          {selectedParticipant.data.sampleLink ? (
                            <a
                              href={selectedParticipant.data.sampleLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        <p><span className="font-semibold text-red-600">Additional Comments:</span> {selectedParticipant.data.additionalComments || 'N/A'}</p>
                      </>
                    )}
                    {selectedParticipant.type === 'press' && (
                      <>
                        <p><span className="font-semibold text-red-600">Email:</span> {selectedParticipant.data.email}</p>
                        <p><span className="font-semibold text-red-600">Phone:</span> {selectedParticipant.data.phoneNumber || 'N/A'}</p>
                        <p><span className="font-semibold text-red-600">Media Outlet:</span> {selectedParticipant.data.mediaOutlet}</p>
                        <p><span className="font-semibold text-red-600">Position:</span> {selectedParticipant.data.position}</p>
                        {selectedParticipant.data.otherPosition && (
                          <p><span className="font-semibold text-red-600">Other Position:</span> {selectedParticipant.data.otherPosition}</p>
                        )}
                        <p><span className="font-semibold text-red-600">City/Country:</span> {selectedParticipant.data.cityCountry}</p>
                        <p>
                          <span className="font-semibold text-red-600">Social Links:</span>{' '}
                          {selectedParticipant.data.socialLinks ? (
                            <a
                              href={selectedParticipant.data.socialLinks}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {selectedParticipant.data.socialLinks}
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        <p><span className="font-semibold text-red-600">Coverage Plan:</span> {selectedParticipant.data.coveragePlan}</p>
                        {selectedParticipant.data.otherCoverage && (
                          <p><span className="font-semibold text-red-600">Other Coverage:</span> {selectedParticipant.data.otherCoverage}</p>
                        )}
                        <p><span className="font-semibold text-red-600">Past Coverage:</span> {selectedParticipant.data.pastCoverage}</p>
                        <p>
                          <span className="font-semibold text-red-600">Past Coverage Links:</span>{' '}
                          {selectedParticipant.data.pastCoverageLinks ? (
                            <a
                              href={selectedParticipant.data.pastCoverageLinks}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </p>
                        <p><span className="font-semibold text-red-600">Interest:</span> {selectedParticipant.data.interest}</p>
                        <p><span className="font-semibold text-red-600">Special Requirements:</span> {selectedParticipant.data.specialRequirements || 'N/A'}</p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default ViewParticipants;