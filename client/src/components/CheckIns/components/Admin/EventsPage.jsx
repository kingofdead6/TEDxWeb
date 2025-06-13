import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import EventModal from './EventModal'; // Adjust path as needed
import { API_BASE_URL } from '../../../../../api';

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [dateFilterType, setDateFilterType] = useState('single');
  const [dateFilter, setDateFilter] = useState({ singleDate: '', startDate: '', endDate: '' });
  const [user, setUser] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch user to check admin status
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

  // Fetch events
  const fetchEvents = async (isRetry = false) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/events`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(response.data);
      setFilteredEvents(response.data);
      setError('');
      setFetchFailed(false);
    } catch (err) {
      console.error('Fetch events error:', err.response?.data || err.message);
      if (!isRetry) {
        setTimeout(() => fetchEvents(true), 2000);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch events');
        setFetchFailed(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter events based on search and filters
  useEffect(() => {
    const today = new Date();
    const filtered = events.filter((event) => {
      const nameMatch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());
      let stateMatch = true;
      if (stateFilter !== 'all') {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        if (stateFilter === 'today') stateMatch = eventDate === today.toISOString().split('T')[0];
        else if (stateFilter === 'upcoming') stateMatch = new Date(eventDate) > today;
        else if (stateFilter === 'finished') stateMatch = new Date(eventDate) < today;
      }
      let dateMatch = true;
      if (dateFilterType === 'single' && dateFilter.singleDate) {
        dateMatch = new Date(event.date).toISOString().split('T')[0] === dateFilter.singleDate;
      } else if (dateFilterType === 'range' && (dateFilter.startDate || dateFilter.endDate)) {
        const eventDateOnly = new Date(event.date);
        const start = new Date(dateFilter.startDate || '1970-01-01');
        const end = new Date(dateFilter.endDate || '9999-12-31');
        dateMatch = eventDateOnly >= start && eventDateOnly <= end;
      }
      return nameMatch && stateMatch && dateMatch;
    });
    setFilteredEvents(filtered);
  }, [events, searchTerm, stateFilter, dateFilter, dateFilterType]);

  // Update event after editing
  const handleUpdateEvent = (updatedEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    setFilteredEvents(filteredEvents.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    setSelectedEvent(updatedEvent);
  };

  // Open modal with event details
  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
  };

  // Clear search term
  const clearSearch = () => setSearchTerm('');

  // Clear date filter
  const clearDateFilter = () => {
    setDateFilter({ singleDate: '', startDate: '', endDate: '' });
  };

  // Animation variants
  const cardVariants = {
    initial: { scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.05,
      boxShadow: '0 10px 20px rgba(210, 0, 0, 0.3)',
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

  function EventCard({ event }) {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <motion.div
        className="relative overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 h-full flex flex-col cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        onClick={() => openModal(event)}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
        <div className="p-6 flex flex-col flex-grow">
          {event.picture && (
            <img
              src={event.picture}
              alt={event.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h3 className="text-xl font-bold text-gray-800 mb-3">{event.title}</h3>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location || 'Location not specified'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formattedDate} • {formattedTime}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen mt-10 p-4 sm:p-6">
      <motion.div
        className="container mx-auto max-w-5xl bg-white bg-opacity-95 rounded-lg border border-gray-200 overflow-hidden"
        initial="initial"
        whileHover="hover"
        variants={cardVariants}
      >
        <div className="bg-red-600 p-4 text-white">
          <motion.h2
            className="text-2xl sm:text-3xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Events
          </motion.h2>
        </div>

        <div className="p-6 sm:p-8">
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm sm:text-base"
              variants={elementVariants}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className="sticky top-0 z-10 bg-white bg-opacity-95 rounded-md border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-end"
            variants={elementVariants}
          >
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <label htmlFor="search" className="sr-only">
                  Search by event name
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by event name..."
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-sm sm:text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search events"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Clear search"
                  >
                    <FiX className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </form>
            </div>

            <div className="w-full sm:w-48">
              <label htmlFor="stateFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Event Status
              </label>
              <select
                id="stateFilter"
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="cursor-pointer w-full p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-sm sm:text-base"
                aria-label="Filter by event status"
              >
                <option value="all">All</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Filter
              </label>
              <div className="flex gap-2 mb-2">
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    value="single"
                    checked={dateFilterType === 'single'}
                    onChange={() => setDateFilterType('single')}
                    className="mr-1 focus:ring-red-500"
                    aria-label="Filter by single date"
                  />
                  Single
                </label>
                <label className="flex items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    value="range"
                    checked={dateFilterType === 'range'}
                    onChange={() => setDateFilterType('range')}
                    className="mr-1 focus:ring-red-500"
                    aria-label="Filter by date range"
                  />
                  Range
                </label>
              </div>
              {dateFilterType === 'single' ? (
                <div className="relative">
                  <input
                    type="date"
                    value={dateFilter.singleDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, singleDate: e.target.value })}
                    className="w-full sm:w-48 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-sm sm:text-base"
                    aria-label="Select event date"
                  />
                  {dateFilter.singleDate && (
                    <button
                      type="button"
                      onClick={clearDateFilter}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      aria-label="Clear date filter"
                    >
                      <FiX className="text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
                    placeholder="Start Date"
                    className="cursor-pointer w-full sm:w-48 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-sm sm:text-base"
                    aria-label="Select start date"
                  />
                  <input
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
                    placeholder="End Date"
                    className="w-full sm:w-48 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 text-sm sm:text-base"
                    aria-label="Select end date"
                  />
                  {(dateFilter.startDate || dateFilter.endDate) && (
                    <button
                      type="button"
                      onClick={clearDateFilter}
                      className="flex items-center px-3 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200"
                      aria-label="Clear date range filter"
                    >
                      <FiX className="text-gray-600" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {isLoading && (
            <motion.div className="text-center py-12" variants={elementVariants}>
              <div className="inline-block w-8 h-8 border-4 border-t-red-600 border-gray-200 rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-700 text-sm sm:text-base">Loading events...</p>
            </motion.div>
          )}

          {!isLoading && fetchFailed && (
            <motion.div className="text-center py-12" variants={elementVariants}>
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-700">Unable to load events</h3>
              <p className="mt-1 text-gray-500 text-sm sm:text-base">
                Please check your connection or try again.
              </p>
              <motion.button
                onClick={() => fetchEvents()}
                className="cursor-pointer mt-4 px-6 py-2 bg-red-600 text-white rounded-md font-medium transition duration-200 hover:bg-red-700"
                variants={elementVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Retry
              </motion.button>
            </motion.div>
          )}

          {!isLoading && !fetchFailed && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } },
              }}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    variants={elementVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!isLoading && !fetchFailed && filteredEvents.length === 0 && (
            <motion.div className="mt-8 text-center py-12" variants={elementVariants}>
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
                {searchTerm || stateFilter !== 'all' || dateFilter.singleDate || dateFilter.startDate || dateFilter.endDate
                  ? 'No matching events found'
                  : 'No events found'}
              </h3>
              <p className="mt-1 text-sm sm:text-base">
                {searchTerm || stateFilter !== 'all' || dateFilter.singleDate || dateFilter.startDate || dateFilter.endDate
                  ? 'Try adjusting your filters'
                  : 'No events are available at this time'}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={closeModal}
            userRole={user?.role}
            onUpdate={handleUpdateEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default EventsPage;