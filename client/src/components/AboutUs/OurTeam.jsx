import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../api';
import { Instagram, Linkedin, Youtube, Globe, X } from 'lucide-react';

const OurTeam = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/team-members`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const visibleMembers = response.data
          .filter((member) => member.isVisibleOnMainPage)
          .map((member) => ({
            id: member.id,
            name: member.fullName,
            role: member.role,
            pfp: member.pfp || 'https://via.placeholder.com/240?text=Image+Not+Found',
            description: member.description || 'No description available.',
            linkedin: member.linkedin || '',
            instagram: member.instagram || '',
            youtube: member.youtube || '',
            website: member.website || '',
          }));
        setTeamMembers(visibleMembers);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch team members');
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  const openModal = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <section className="relative py-20 text-black min-h-screen">
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* Title */}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
        className="text-5xl sm:text-6xl md:text-6xl font-extrabold text-center mb-16"
      >
        Our Team
      </motion.h1>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 mb-8 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 text-center">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block w-10 h-10 border-4 border-t-red-600 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-700">Loading team members...</p>
        </div>
      ) : (
        <>
          {/* Team Grid */}
          {teamMembers.length > 0 ? (
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => openModal(member)}
                >
                  <div className="w-60 h-60 overflow-hidden rounded-lg">
                    <img
                      src={member.pfp}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/240?text=Image+Not+Found';
                      }}
                    />
                  </div>
                  <p className="mt-4 text-lg font-semibold">{member.name}</p>
                  <p className="text-md text-gray-400">{member.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700 text-lg">No visible team members found.</p>
          )}
        </>
      )}

      {/* Modal for Team Member Details */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-[#00000058] backdrop-blur-md flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="cursor-pointer absolute top-4 right-4 text-gray-600 hover:text-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center overflow-y-auto no-scrollbar max-h-[70vh]">
              <img
                src={selectedMember.pfp}
                alt={selectedMember.name}
                className="w-32 h-32 rounded-full object-cover mb-4"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/240?text=Image+Not+Found';
                }}
              />
              <h2 className="text-2xl font-bold text-black">{selectedMember.name}</h2>
              <p className="text-lg text-gray-600">{selectedMember.role}</p>
              <p className="text-md text-gray-700 mt-4 text-center px-4">
                {selectedMember.description}
              </p>

              {/* Social Media Links */}
              <div className="mt-6 flex space-x-4">
                {selectedMember.linkedin && (
                  <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-6 h-6 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
                  </a>
                )}
                {selectedMember.instagram && (
                  <a href={selectedMember.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors duration-200" />
                  </a>
                )}
                {selectedMember.youtube && (
                  <a href={selectedMember.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-6 h-6 text-gray-600 hover:text-red-600 transition-colors duration-200" />
                  </a>
                )}
                {selectedMember.website && (
                  <a href={selectedMember.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-6 h-6 text-gray-600 hover:text-green-600 transition-colors duration-200" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default OurTeam;
