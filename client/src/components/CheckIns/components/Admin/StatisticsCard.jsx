/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../../../../../api';
import { FiSearch, FiX } from 'react-icons/fi';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Statistics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalRegisteredUsers: 0,
    eventStats: [],
    genderStats: [],
    howHeardStats: [],
    ageStats: [],
  });
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const modalRef = useRef(null);
  const userModalRef = useRef(null);

  // Fetch statistics and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch statistics
        const statsRes = await axios.get(`${API_BASE_URL}/admin/statistics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(statsRes.data);
        setFilteredEvents(statsRes.data.eventStats);

        // Fetch users
        const usersRes = await axios.get(`${API_BASE_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(usersRes.data);
        setFilteredUsers(usersRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  // Filter events based on search
  useEffect(() => {
    const filtered = stats.eventStats.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, stats.eventStats]);

  // Filter users based on search
  useEffect(() => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [userSearchTerm, users]);

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };


  const closeUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Handle Escape key and click outside for modals
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        if (showUserModal) closeUserModal();
        else if (showModal) closeModal();
      }
    },
    [showModal, showUserModal]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const handleUserClickOutside = (e) => {
    if (userModalRef.current && !userModalRef.current.contains(e.target)) {
      closeUserModal();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const clearSearch = () => setSearchTerm('');

  // Max values for circular progress bars
  const MAX_USERS = 1000;
  const MAX_EVENTS = 200;
  const MAX_REGISTRATIONS = 5000;

  // Bar chart for event registrations
  const barData = {
    labels: stats.eventStats.map((event) => event.title),
    datasets: [
      {
        label: 'Total Registrations',
        data: stats.eventStats.map((event) => event.totalRegistrations),
        backgroundColor: '#e62b1e',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Event Registrations Overview' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Count' } },
    },
  };

  // Doughnut chart for gender distribution
  const genderData = {
    labels: stats.genderStats.map((stat) => stat.gender || 'Unspecified'),
    datasets: [
      {
        data: stats.genderStats.map((stat) => stat.count),
        backgroundColor: ['#e62b1e', '#ff7b7b', '#ffaaa5', '#ffd3b6'],
        borderColor: ['white'],
        borderWidth: 2,
      },
    ],
  };

  const genderOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Gender Distribution' },
    },
  };

  // Doughnut chart for registration sources
  const howHeardData = {
    labels: stats.howHeardStats.map((stat) => stat.source || 'Unspecified'),
    datasets: [
      {
        data: stats.howHeardStats.map((stat) => stat.count),
        backgroundColor: ['#e62b1e', '#ff7b7b', '#ffaaa5', '#ffd3b6', '#a8dadc'],
        borderColor: ['white'],
        borderWidth: 2,
      },
    ],
  };

  const howHeardOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: true, text: 'Registration Sources' },
    },
  };

  // Bar chart for age distribution
  const ageData = {
    labels: stats.ageStats.map((stat) => stat.ageRange),
    datasets: [
      {
        label: 'Attendees',
        data: stats.ageStats.map((stat) => stat.count),
        backgroundColor: '#e62b1e',
      },
    ],
  };

  const ageOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Age Distribution' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Count' } },
    },
  };

  // Format functions
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const formatArray = (arr) => {
    if (!arr || arr.length === 0) return 'None';
    return arr.join(', ');
  };

  // Event Statistics Modal
  function EventStatsModal({ event }) {
    const checkInPercentage =
      event.totalRegistrations > 0 ? (event.checkedIn / event.totalRegistrations) * 100 : 0;

    return (
      <motion.div
        className="fixed inset-0 bg-[#00000057] backdrop-blur-lg flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClickOutside}
        role="dialog"
        aria-labelledby="stats-modal-title"
      >
        <motion.div
          ref={modalRef}
          className="w-full max-w-md sm:max-w-lg bg-white bg-opacity-95 rounded-3xl border border-red-100 p-6 sm:p-8"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <h3
            id="stats-modal-title"
            className="text-xl sm:text-2xl font-bold text-[#e62b1e] mb-4 text-center"
          >
            {event.title} Statistics
          </h3>
          <div className="space-y-4">
            <p className="text-gray-700">
              <strong>Total Registrations:</strong> {event.totalRegistrations}
            </p>
            <p className="text-gray-700">
              <strong>Checked In:</strong> {event.checkedIn}
            </p>
            <p className="text-gray-700">
              <strong>Not Checked In:</strong> {event.notCheckedIn}
            </p>
            <div className="w-32 h-32 mx-auto">
              <CircularProgressbar
                value={checkInPercentage}
                text={`${Math.round(checkInPercentage)}%`}
                styles={buildStyles({
                  pathColor: '#e62b1e',
                  textColor: '#e62b1e',
                  trailColor: '#ff7b7b',
                })}
              />
            </div>
          </div>
          <motion.button
            onClick={closeModal}
            className="cursor-pointer mt-6 w-full bg-[#e62b1e] text-white p-3 rounded-xl font-semibold hover:bg-[#c8241a] transition duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            aria-label="Close statistics modal"
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // User Details Modal
  function UserDetailsModal({ user }) {
    return (
      <motion.div
        className="fixed inset-0 bg-[#00000057] backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleUserClickOutside}
        role="dialog"
        aria-labelledby="user-modal-title"
      >
        <motion.div
          ref={userModalRef}
          className="w-full max-w-md sm:max-w-lg bg-white rounded-3xl border border-red-100 p-6 sm:p-8 max-h-[80vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              id="user-modal-title"
              className="text-xl sm:text-2xl font-bold text-[#e62b1e]"
            >
              User Details
            </h3>
            <button
              onClick={closeUserModal}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="space-y-4 text-gray-700">
            <h4 className="text-lg font-semibold">User Information</h4>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name || 'N/A'}</p>
            <p><strong>Email:</strong> {user.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
            <p><strong>Team:</strong> {user.team || 'N/A'}</p>
            <p><strong>Role in Team:</strong> {user.roleInTeam || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role || 'N/A'}</p>
            <p><strong>Created At:</strong> {formatDate(user.createdAt)}</p>
            {user.attendee ? (
              <>
                <h4 className="text-lg font-semibold mt-6">Attendee Information</h4>
                <p><strong>Full Name:</strong> {user.attendee.fullName || 'N/A'}</p>
                <p><strong>Email:</strong> {user.attendee.email || 'N/A'}</p>
                <p><strong>Phone Number:</strong> {user.attendee.phoneNumber || 'N/A'}</p>
                <p><strong>Gender:</strong> {user.attendee.gender || 'Not specified'}</p>
                <p><strong>How Heard:</strong> {user.attendee.howHeard || 'Not specified'}</p>
                <p><strong>Date of Birth:</strong> {formatDate(user.attendee.dateOfBirth)}</p>
                <p><strong>City/Country:</strong> {user.attendee.cityCountry || 'N/A'}</p>
                <p><strong>Occupation:</strong> {user.attendee.occupation || 'N/A'}</p>
                <p><strong>Company/University:</strong> {user.attendee.companyUniversity || 'N/A'}</p>
                <p><strong>Event Choice:</strong> {user.attendee.eventChoice || 'N/A'}</p>
                <p><strong>Other Event:</strong> {user.attendee.eventOther || 'N/A'}</p>
                <p><strong>Reason to Attend:</strong> {user.attendee.reasonToAttend || 'N/A'}</p>
                <p><strong>Attended Before:</strong> {user.attendee.attendedBefore || 'N/A'}</p>
                <p><strong>Previous Events:</strong> {user.attendee.previousEvents || 'N/A'}</p>
                <p><strong>How Heard (Other):</strong> {user.attendee.howHeardOther || 'N/A'}</p>
                <p><strong>Dietary Restrictions:</strong> {user.attendee.dietaryRestrictions || 'N/A'}</p>
                <p><strong>Interests:</strong> {formatArray(user.attendee.interests)}</p>
                <p><strong>Interests (Other):</strong> {user.attendee.interestsOther || 'N/A'}</p>
                <p><strong>Receive Updates:</strong> {user.attendee.receiveUpdates || 'N/A'}</p>
                <p><strong>Created At:</strong> {formatDate(user.attendee.createdAt)}</p>
                <p><strong>Updated At:</strong> {formatDate(user.attendee.updatedAt)}</p>
              </>
            ) : (
              <p className="text-gray-500 italic">No attendee information available for this user.</p>
            )}
          </div>
          <motion.button
            onClick={closeUserModal}
            className="mt-6 w-full bg-[#e62b1e] text-white p-3 rounded-xl font-semibold hover:bg-[#c8241a] transition duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            aria-label="Close user details modal"
          >
            Close
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  // Animation variants
  const cardVariants = {
    initial: { scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 20px rgba(230, 43, 30, 0.3)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 mb-20 mt-10">
      <motion.div
        className="container mx-auto max-w-5xl bg-white bg-opacity-95 rounded-3xl border border-red-100 overflow-hidden"
        initial="initial"
        whileHover="hover"
        variants={cardVariants}
      >
        {/* Header */}
        <div className="bg-[#e62b1e] p-4 text-white">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Statistics
          </motion.h2>
        </div>

        <div className="p-6 sm:p-8">
          {/* Error Message */}
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 text-red-900 rounded-lg border border-red-200 text-sm sm:text-base"
              variants={elementVariants}
            >
              {error}
            </motion.div>
          )}

          {/* Circular Progress Indicators */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
            variants={elementVariants}
          >
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Users</h3>
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={(stats.totalUsers / MAX_USERS) * 100}
                  text={`${stats.totalUsers}`}
                  styles={buildStyles({
                    pathColor: '#e62b1e',
                    textColor: '#e62b1e',
                    trailColor: '#f3f4f6',
                  })}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Events</h3>
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={(stats.totalEvents / MAX_EVENTS) * 100}
                  text={`${stats.totalEvents}`}
                  styles={buildStyles({
                    pathColor: '#e62b1e',
                    textColor: '#e62b1e',
                    trailColor: '#f3f4f6',
                  })}
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Registrations</h3>
              <div className="w-32 h-32">
                <CircularProgressbar
                  value={(stats.totalRegisteredUsers / MAX_REGISTRATIONS) * 100}
                  text={`${stats.totalRegisteredUsers}`}
                  styles={buildStyles({
                    pathColor: '#e62b1e',
                    textColor: '#e62b1e',
                    trailColor: '#f3f4f6',
                  })}
                />
              </div>
            </div>
          </motion.div>

          {/* Demographic Charts */}
          <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" variants={elementVariants}>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Gender Distribution</h3>
              <div className="w-full max-w-xs mx-auto">
                <Doughnut data={genderData} options={genderOptions} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Registration Sources</h3>
              <div className="w-full max-w-xs mx-auto">
                <Doughnut data={howHeardData} options={howHeardOptions} />
              </div>
            </div>
          </motion.div>

          <motion.div className="mb-8" variants={elementVariants}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Age Distribution</h3>
            <div className="w-full max-w-3xl mx-auto">
              <Bar data={ageData} options={ageOptions} />
            </div>
          </motion.div>

          {/* Event Search Bar */}
          <motion.div className="mb-6" variants={elementVariants}>
            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
              <label htmlFor="event-search" className="sr-only">
                Search events
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                id="event-search"
                type="text"
                placeholder="Search by event name..."
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search events"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  aria-label="Clear event search"
                >
                  <FiX className="text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </form>
          </motion.div>

          {/* Event Registrations Bar Chart */}
          <motion.div className="mb-8" variants={elementVariants}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Event Registrations Overview</h3>
            <div className="w-full max-w-3xl mx-auto">
              <Bar data={barData} options={barOptions} />
            </div>
          </motion.div>

          {/* Event Statistics List */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  className="p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  variants={elementVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  onClick={() => openModal(event)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View statistics for ${event.title}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      openModal(event);
                    }
                  }}
                >
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#e62b1e]"></div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h4>
                  <p className="text-gray-600 text-sm">
                    Total Registrations: {event.totalRegistrations}
                  </p>
                  <p className="text-gray-600 text-sm">Checked In: {event.checkedIn}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Events Message */}
          {!filteredEvents.length && !error && (
            <motion.div
              className="mt-8 text-center py-12"
              variants={elementVariants}
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium">
                {searchTerm ? 'No matching events found' : 'No events found'}
              </h3>
              <p className="mt-1">
                {searchTerm ? 'Try adjusting your search' : 'No event statistics available'}
              </p>
            </motion.div>
          )}

        </div>
      </motion.div>

      {/* Event Statistics Modal */}
      <AnimatePresence>
        {showModal && selectedEvent && <EventStatsModal event={selectedEvent} />}
      </AnimatePresence>

      {/* User Details Modal */}
      <AnimatePresence>
        {showUserModal && selectedUser && <UserDetailsModal user={selectedUser} />}
      </AnimatePresence>
    </div>
  );
}

export default Statistics;