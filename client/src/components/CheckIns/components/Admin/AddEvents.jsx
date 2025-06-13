import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Select from 'react-select';
import { API_BASE_URL } from '../../../../../api';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function AddEvents() {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    description: '',
    location: '',
    responsibles: [],
    theme: '',
    watchTalks: '',
    speakerIds: [],
    partnerIds: [],
    seats: '',
    isRegistrationOpen: true,
    picture: null,
    gallery: [],
  });
  const [users, setUsers] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [picturePreview, setPicturePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const navigate = useNavigate();

  // Retry logic for API calls
  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, options);
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  // Fetch users, speakers, and partners on component mount
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to access this page', {
          style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
        });
        navigate('/login');
        return;
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, speakersRes, partnersRes] = await Promise.all([
          fetchWithRetry(`${API_BASE_URL}/admin/users`, { headers }).catch(() => ({ data: [] })),
          fetchWithRetry(`${API_BASE_URL}/speakers`, { headers }).catch(() => ({ data: [] })),
          fetchWithRetry(`${API_BASE_URL}/partners`, { headers }).catch(() => ({ data: [] })),
        ]);

        setUsers(usersRes.data);
        setSpeakers(speakersRes.data);
        setPartners(partnersRes.data);

        if (!partnersRes.data.length) {
          toast.warn('No partners fetched. You can still create an event without partners.', {
            style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
          });
        }
        if (!usersRes.data.length) {
          toast.warn('No non-admin users fetched. You can still create an event without responsibles.', {
            style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
          });
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch data. Please check your network or database connection.');
        toast.error(
          err.response?.data?.message ||
            'Failed to fetch data. The database server may be unreachable. Please try again later.',
          {
            style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
          }
        );
      }
    };
    fetchData();
  }, [navigate]);

  // Handle file changes with preview
  const handleFileChange = (e, field) => {
    if (field === 'picture') {
      const file = e.target.files[0];
      if (file && file.size > 5 * 1024 * 1024) {
        toast.error('Picture file size must be less than 5MB', {
          style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
        });
        return;
      }
      if (file) {
        setPicturePreview(URL.createObjectURL(file));
      } else {
        setPicturePreview(null);
      }
      setEventData({ ...eventData, picture: file });
    } else if (field === 'gallery') {
      const files = Array.from(e.target.files).slice(0, 10);
      if (files.some(file => file.size > 5 * 1024 * 1024)) {
        toast.error('Each gallery image must be less than 5MB', {
          style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
        });
        return;
      }
      setGalleryPreviews(files.map(file => URL.createObjectURL(file)));
      setEventData({ ...eventData, gallery: files });
    }
  };

  // Handle multi-select changes
  const handleMultiSelect = (selectedOptions, field) => {
    const values = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setEventData({ ...eventData, [field]: values });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventData.title || !eventData.date || !eventData.location || !eventData.theme) {
      toast.error('Please fill in all required fields (Title, Date, Location, Theme)', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to add an event', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
      navigate('/login');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('date', new Date(eventData.date).toISOString());
    formData.append('description', eventData.description || '');
    formData.append('location', eventData.location);
    formData.append('theme', eventData.theme);
    formData.append('watchTalks', eventData.watchTalks || '');
    formData.append('seats', eventData.seats || '');
    formData.append('isRegistrationOpen', eventData.isRegistrationOpen.toString());

    if (eventData.responsibles.length) {
      eventData.responsibles.forEach(id => formData.append('responsibles[]', id));
    }
    if (eventData.speakerIds.length) {
      eventData.speakerIds.forEach(id => formData.append('speakerIds[]', id));
    }
    if (eventData.partnerIds.length) {
      eventData.partnerIds.forEach(id => formData.append('partnerIds[]', id));
    }

    if (eventData.picture) {
      formData.append('picture', eventData.picture);
    }
    eventData.gallery.forEach(file => {
      formData.append('gallery', file);
    });

    try {
      await axios.post(`${API_BASE_URL}/events`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
      
      toast.success('Event created successfully!', {
        style: { 
          background: '#10B981', 
          color: '#fff', 
          borderRadius: '8px', 
          border: '1px solid #059669',
          fontSize: '14px',
          padding: '12px',
        },
        duration: 4000,
      });
      
      // Reset form
      setEventData({
        title: '',
        date: '',
        description: '',
        location: '',
        responsibles: [],
        theme: '',
        watchTalks: '',
        speakerIds: [],
        partnerIds: [],
        seats: '',
        isRegistrationOpen: true,
        picture: null,
        gallery: [],
      });
      setPicturePreview(null);
      setGalleryPreviews([]);
      
    } catch (err) {
      console.error('Submit error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add event';
      toast.error(errorMessage, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.', {
          style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
        });
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Responsive styles
  const inputClass = 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white hover:border-gray-400 text-sm sm:text-base';
  const textareaClass = 'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-200 bg-white hover:border-gray-400 resize-vertical min-h-[100px] text-sm sm:text-base';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-2';
  const buttonClass = 'w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 flex items-center justify-center cursor-pointer';
  const fileInputClass = 'w-full p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-red-100 file:text-red-600 file:cursor-pointer file:hover:bg-red-200 transition duration-200 text-sm sm:text-base';

  // react-select custom styles for responsiveness
  const selectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '48px',
      fontSize: '14px',
      '@media (min-width: 640px)': {
        fontSize: '16px',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      fontSize: '14px',
      '@media (min-width: 640px)': {
        fontSize: '16px',
      },
    }),
    option: (provided) => ({
      ...provided,
      fontSize: '14px',
      '@media (min-width: 640px)': {
        fontSize: '16px',
      },
    }),
  };

  // Options for react-select
  const responsibleOptions = users.map((user) => ({
    value: user.id,
    label: user.name,
  }));
  const speakerOptions = speakers.map((speaker) => ({
    value: speaker.id,
    label: speaker.fullName,
  }));
  const partnerOptions = partners.map((partner) => ({
    value: partner.id,
    label: partner.organizationName,
  }));
  const registrationOptions = [
    { value: true, label: 'Open' },
    { value: false, label: 'Closed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <motion.div
        className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-red-600 mb-6 sm:mb-8 text-center">
          Add Event
        </h2>

        {error && (
          <div className="mb-4 sm:mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm sm:text-base">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.form
            key="event"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
              Event Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className={labelClass}>Title</label>
                <input
                  type="text"
                  className={inputClass}
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  className={textareaClass}
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input
                  type="text"
                  className={inputClass}
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <label className={labelClass}>Theme</label>
                <input
                  type="text"
                  className={inputClass}
                  value={eventData.theme}
                  onChange={(e) => setEventData({ ...eventData, theme: e.target.value })}
                  required
                  aria-required="true"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Responsibles</label>
                <Select
                  isMulti
                  options={responsibleOptions}
                  value={responsibleOptions.filter((option) => eventData.responsibles.includes(option.value))}
                  onChange={(selected) => handleMultiSelect(selected, 'responsibles')}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select responsibles..."
                  styles={selectStyles}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Speakers</label>
                <Select
                  isMulti
                  options={speakerOptions}
                  value={speakerOptions.filter((option) => eventData.speakerIds.includes(option.value))}
                  onChange={(selected) => handleMultiSelect(selected, 'speakerIds')}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select speakers..."
                  styles={selectStyles}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Partners</label>
                <Select
                  isMulti
                  options={partnerOptions}
                  value={partnerOptions.filter((option) => eventData.partnerIds.includes(option.value))}
                  onChange={(selected) => handleMultiSelect(selected, 'partnerIds')}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select partners..."
                  styles={selectStyles}
                />
              </div>
              <div>
                <label className={labelClass}>Number of Seats</label>
                <input
                  type="number"
                  className={inputClass}
                  value={eventData.seats}
                  onChange={(e) => setEventData({ ...eventData, seats: e.target.value })}
                  min="0"
                  placeholder="Enter number of seats"
                />
              </div>
              <div>
                <label className={labelClass}>Registration Status</label>
                <Select
                  options={registrationOptions}
                  value={registrationOptions.find((option) => option.value === eventData.isRegistrationOpen)}
                  onChange={(selected) => setEventData({ ...eventData, isRegistrationOpen: selected.value })}
                  className="basic-single-select"
                  classNamePrefix="select"
                  placeholder="Select status..."
                  styles={selectStyles}
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className={labelClass}>Watch Talks Link</label>
                <input
                  type="url"
                  className={inputClass}
                  value={eventData.watchTalks}
                  onChange={(e) => setEventData({ ...eventData, watchTalks: e.target.value })}
                />
              </div>
              <div>
                <label className={labelClass}>Event Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  className={fileInputClass}
                  onChange={(e) => handleFileChange(e, 'picture')}
                />
                {picturePreview && (
                  <div className="mt-2">
                    <img
                      src={picturePreview}
                      alt="Event Picture Preview"
                      className="w-full max-w-xs rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className={labelClass}>Gallery Images (Max 10)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className={fileInputClass}
                  onChange={(e) => handleFileChange(e, 'gallery')}
                />
                {galleryPreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {galleryPreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`Gallery Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <motion.button
              type="submit"
              className={buttonClass}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Event'
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default AddEvents;