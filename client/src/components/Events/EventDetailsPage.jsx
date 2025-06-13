import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../../../api';
import { FiPlus, FiEdit2, FiX, FiSave } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [speakers, setSpeakers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Fetch user error:', err);
        setError('Failed to fetch user profile');
      }
    };
    fetchUser();
  }, []);

  // Fetch event
  const fetchEvent = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvent(res.data);
      setFormData({
        date: res.data.date ? new Date(res.data.date).toISOString().slice(0, 16) : '',
        description: res.data.description || '',
        location: res.data.location || '',
        theme: res.data.theme || '',
        responsibles: res.data.responsibles || [''],
        watchTalks: res.data.watchTalks || '',
        speakerIds: res.data.speakers?.map((s) => ({ value: s.id, label: s.fullName })) || [],
        partnerIds: res.data.partners?.map((p) => ({ value: p.id, label: p.organizationName })) || [],
        picture: null,
      });
      setError('');
    } catch (err) {
      console.error('Fetch event error:', err);
      setError(err.response?.data?.message || 'Failed to fetch event');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  // Fetch speakers and partners
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [speakersRes, partnersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/speakers`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get(`${API_BASE_URL}/partners`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      }),
        ]);
        setSpeakers(speakersRes.data.map((s) => ({ value: s.id, label: s.fullName })));
        setPartners(partnersRes.data.map((p) => ({ value: p.id, label: p.organizationName })));
      } catch (err) {
        console.error('Fetch speakers/partners error:', err);
        setError('Failed to load speakers or partners');
      }
    };
    fetchData();
  }, []);

  // Auto-scroll gallery
  useEffect(() => {
    if (event?.gallery?.length > 1) {
      const interval = setInterval(() => {
        setGalleryIndex((prev) => (prev + 1) % event.gallery.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [event?.gallery]);

  // Handle edit toggle
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setFormData({
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        description: event.description || '',
        location: event.location || '',
        theme: event.theme || '',
        responsibles: event.responsibles || [''],
        watchTalks: event.watchTalks || '',
        speakerIds: event.speakers?.map((s) => ({ value: s.id, label: s.fullName })) || [],
        partnerIds: event.partners?.map((p) => ({ value: p.id, label: p.organizationName })) || [],
        picture: null,
      });
    }
    setError('');
  };

  // Handle form changes
  const handleInputChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFileChange = (e, field) => {
    setFormData({ ...formData, [field]: e.target.files[0] });
  };

  const addResponsibleField = () => {
    setFormData({ ...formData, responsibles: [...formData.responsibles, ''] });
  };

  const removeResponsibleField = (index) => {
    setFormData({
      ...formData,
      responsibles: formData.responsibles.filter((_, i) => i !== index),
    });
  };

  const updateResponsible = (index, value) => {
    const updated = [...formData.responsibles];
    updated[index] = value;
    setFormData({ ...formData, responsibles: updated });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date?.trim() || !formData.location?.trim() || !formData.theme?.trim()) {
      setError('Date, location, and theme are required');
      toast.error('Date, location, and theme are required', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e0e0e0' },
      });
      return;
    }

    setIsSubmitting(true);
    const form = new FormData();
    form.append('date', formData.date);
    form.append('description', formData.description);
    form.append('location', formData.location);
    form.append('theme', formData.theme);
    form.append('responsibles', JSON.stringify(formData.responsibles.filter((name) => name.trim() !== '')));
    form.append('watchTalks', formData.watchTalks);
    if (formData.speakerIds.length > 0) {
      form.append('speakerIds', JSON.stringify(formData.speakerIds.map((s) => s.value)));
    }
    if (formData.partnerIds.length > 0) {
      form.append('partnerIds', JSON.stringify(formData.partnerIds.map((p) => p.value)));
    }
    if (formData.picture) {
      form.append('picture', formData.picture);
    }

    try {
      const res = await axios.put(`${API_BASE_URL}/events/${id}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setEvent(res.data);
      setIsEditing(false);
      setError('');
      toast.success('Event updated successfully', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e0e0e0' },
      });
    } catch (err) {
      console.error('Update event error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update event';
      setError(errorMessage);
      toast.error(errorMessage, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e0e0e0' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle gallery image upload
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsSubmitting(true);
    const form = new FormData();
    files.forEach((file) => form.append('gallery', file));

    try {
      const res = await axios.post(`${API_BASE_URL}/events/${id}/gallery`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setEvent({ ...event, gallery: res.data.gallery });
      setError('');
      toast.success('Gallery images added successfully', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e0e0e0' },
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Gallery upload error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload images';
      setError(errorMessage);
      toast.error(errorMessage, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e0e0e0' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block w-10 h-10 border-4 border-t-red-600 border-gray-200 rounded-full animate-spin" aria-label="Loading"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">{error}</div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 pt-20 pb-12 px-4 sm:px-6">
      <Toaster />
      <motion.div
        className="container mx-auto max-w-6xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {error && (
          <motion.div
            className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.div>
        )}
        {/* Main Image Section */}
        <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-lg mb-8">
          {event.picture ? (
            <img
              src={event.picture}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-lg">No Image Available</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{event.title}</h1>
            <p className="text-sm sm:text-lg text-white mt-2">{event.location} • {formattedDate} • {formattedTime}</p>
            {user?.role === 'admin' && (
              <motion.button
                onClick={toggleEdit}
                className="absolute top-4 right-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={isEditing ? 'Cancel editing' : 'Edit event'}
                disabled={isSubmitting}
              >
                {isEditing ? <FiX className="w-5 h-5" /> : <FiEdit2 className="w-5 h-5" />}
              </motion.button>
            )}
          </div>
        </div>

        {/* Details and Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Details Section */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Event Details</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-600 sm:text-base">Date and Time</label>
                    {isEditing ? (
                      <input
                        id="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={(e) => handleInputChange(e, 'date')}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                        required
                        aria-required="true"
                        aria-label="Event date and time"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">{formattedDate} • {formattedTime}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-600 sm:text-base">Location</label>
                    {isEditing ? (
                      <input
                        id="location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange(e, 'location')}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                        required
                        aria-required="true"
                        aria-label="Event location"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">{event.location || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-600 sm:text-base">Theme</label>
                    {isEditing ? (
                      <input
                        id="theme"
                        type="text"
                        value={formData.theme}
                        onChange={(e) => handleInputChange(e, 'theme')}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                        required
                        aria-required="true"
                        aria-label="Event theme"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">{event.theme || 'N/A'}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-600 sm:text-base">Description</label>
                    {isEditing-science
                      ? (
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange(e, 'description')}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 resize-y min-h-[100px] text-sm sm:text-base"
                          aria-label="Event description"
                        />
                      ) : (
                        <p className="text-gray-600 text-sm sm:text-base">{event.description || 'N/A'}</p>
                      )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 sm:text-base">Responsibles</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        {formData.responsibles.map((responsible, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={responsible}
                              onChange={(e) => updateResponsible(index, e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 text-sm sm:text-base"
                              aria-label={`Responsible person ${index + 1}`}
                            />
                            {index === formData.responsibles.length - 1 ? (
                              <motion.button
                                type="button"
                                onClick={addResponsibleField}
                                className="p-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Add another responsible person"
                                disabled={isSubmitting}
                              >
                                <FiPlus className="w-5 h-5" />
                              </motion.button>
                            ) : (
                              <motion.button
                                type="button"
                                onClick={() => removeResponsibleField(index)}
                                className="p-2 bg-gray-200 text-gray-600 hover:bg-gray-300 rounded-md transition duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={`Remove responsible person ${index + 1}`}
                                disabled={isSubmitting}
                              >
                                <FiX className="w-5 h-5" />
                              </motion.button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">
                        {event.responsibles?.length > 0 ? event.responsibles.join(', ') : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="watchTalks" className="block text-sm font-medium text-gray-600 sm:text-base">Watch Talks URL</label>
                    {isEditing ? (
                      <input
                        id="watchTalks"
                        type="url"
                        value={formData.watchTalks}
                        onChange={(e) => handleInputChange(e, 'watchTalks')}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 text-sm sm:text-base"
                        aria-label="Watch talks URL"
                      />
                    ) : event.watchTalks ? (
                      <a
                        href={event.watchTalks}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm sm:text-base"
                        aria-label="Visit watch talks URL"
                      >
                        {event.watchTalks}
                      </a>
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">N/A</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 sm:text-base">Speakers</label>
                    {isEditing ? (
                      <Select
                        isMulti
                        options={speakers}
                        value={formData.speakerIds}
                        onChange={(selected) => setFormData({ ...formData, speakerIds: selected })}
                        className="basic-multi-select text-sm sm:text-base"
                        classNamePrefix="select"
                        placeholder="Select speakers..."
                        aria-label="Select speakers"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">
                        {event.speakers?.length > 0 ? event.speakers.map((s) => s.fullName).join(', ') : 'N/A'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 sm:text-base">Partners</label>
                    {isEditing ? (
                      <Select
                        isMulti
                        options={partners}
                        value={formData.partnerIds}
                        onChange={(selected) => setFormData({ ...formData, partnerIds: selected })}
                        className="basic-multi-select text-sm sm:text-base"
                        classNamePrefix="select"
                        placeholder="Select partners..."
                        aria-label="Select partners"
                      />
                    ) : (
                      <p className="text-gray-600 text-sm sm:text-base">
                        {event.partners?.length > 0 ? event.partners.map((p) => p.organizationName).join(', ') : 'N/A'}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <div>
                      <label htmlFor="picture" className="block text-sm font-medium text-gray-600 sm:text-base">Event Picture</label>
                      <input
                        id="picture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'picture')}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200 text-sm sm:text-base"
                        aria-label="Upload event picture"
                      />
                    </div>
                  )}
                </div>
              </div>
              {isEditing && user?.role === 'admin' && (
                <div className="flex gap-4">
                  <motion.button
                    type="submit"
                    className="flex-1 bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Save changes"
                    disabled={isSubmitting}
                  >
                    <FiSave className="inline mr-2 w-5 h-5" /> {isSubmitting ? 'Saving...' : 'Save'}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={toggleEdit}
                    className="flex-1 bg-gray-200 text-gray-800 p-3 rounded-md hover:bg-gray-300 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Cancel editing"
                    disabled={isSubmitting}
                  >
                    <FiX className="inline mr-2 w-5 h-5" /> Cancel
                  </motion.button>
                </div>
              )}
            </form>
          </div>

          {/* Gallery Section */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Gallery</h3>
            {event.gallery && event.gallery.length > 0 ? (
              <div className="relative min-h-[200px] sm:min-h-[300px] lg:min-h-[400px]">
                <AnimatePresence>
                  <motion.img
                    key={galleryIndex}
                    src={event.gallery[galleryIndex]}
                    alt={`Gallery image ${galleryIndex + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  />
                </AnimatePresence>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  {event.gallery.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIndex(i)}
                      className={`w-2 h-2 rounded-full ${i === galleryIndex ? 'bg-red-600' : 'bg-gray-300'}`}
                      aria-label={`View gallery image ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600 text-sm sm:text-base">No gallery images available</p>
            )}
            {user?.role === 'admin' && (
              <div className="mt-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  onChange={handleGalleryUpload}
                  className="hidden"
                  aria-label="Upload gallery images"
                />
                <motion.button
                  onClick={() => fileInputRef.current.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Add gallery images"
                  disabled={isSubmitting}
                >
                  <FiPlus className="w-5 h-5" /> Add Gallery Images
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

EventDetailsPage.propTypes = {
  // No props are passed directly, but defining for future extensibility
};

export default EventDetailsPage;