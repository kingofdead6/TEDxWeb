import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../api';
import { FiTrash2, FiX, FiSearch, FiArrowUp, FiArrowDown, FiDownload, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

function AdminNewsletter() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [user, setUser] = useState(null);

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

  // Fetch newsletter subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/newsletter`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSubscriptions(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch subscriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/newsletter/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
      if (selectedSubscription?.id === id) setSelectedSubscription(null);
      toast.success('Subscription deleted successfully', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete subscription', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/newsletter/${id}/status`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSubscriptions(subscriptions.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s)));
      if (selectedSubscription?.id === id) setSelectedSubscription({ ...selectedSubscription, isActive: !currentStatus });
      toast.success(`Subscription marked as ${!currentStatus ? 'active' : 'inactive'}`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update subscription status', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  // Handle Excel download
  const handleDownloadExcel = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/newsletter/export`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          responseType: 'blob',
        }
      );

      // Check if response is JSON (error response)
      if (response.headers['content-type'].includes('application/json')) {
        const text = await response.data.text();
        const json = JSON.parse(text);
        throw new Error(json.error || 'Unexpected JSON response from server');
      }

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'newsletter_subscriptions.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Subscriptions exported successfully', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      console.error('Excel download error:', err.message, err);
      toast.error(err.message || 'Failed to export subscriptions. Please try again.', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptions
    .filter(
      (s) =>
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-2 sm:px-4 lg:px-6">
      <Toaster />
      <motion.div
        className="container mx-auto max-w-6xl bg-white rounded-2xl shadow-lg shadow-red-500 p-4 sm:p-6 lg:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 lg:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-600">Newsletter Subscriptions</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={toggleSortOrder}
              className="cursor-pointer flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white text-xl sm:text-base rounded-lg hover:bg-red-700 transition duration-200 touch-action-manipulation"
              aria-label={`Sort ${sortOrder === 'desc' ? 'oldest first' : 'newest first'}`}
            >
              {sortOrder === 'desc' ? <FiArrowDown className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />}
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
            <button
              onClick={handleDownloadExcel}
              className="cursor-pointer flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white text-xl sm:text-base rounded-lg hover:bg-green-700 transition duration-200 touch-action-manipulation"
              aria-label="Download subscriptions as Excel"
            >
              <FiDownload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Download Excel</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4 lg:mb-6">
          <div className="relative">
            <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-8 pr-3 py-2 sm:pl-10 sm:pr-4 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base lg:text-lg text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 lg:p-4 bg-red-50 text-red-800 rounded-lg border border-red-200 text-sm sm:text-base lg:text-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 sm:w-10 sm:h-10 border-4 border-t-red-600 border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-700 text-sm sm:text-base lg:text-lg">Loading subscriptions...</p>
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <div className="text-center py-12 text-gray-600 text-base sm:text-lg lg:text-xl font-semibold">
            No subscriptions found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {filteredSubscriptions.map((subscription) => (
              <motion.div
                key={subscription.id}
                className={`cursor-pointer rounded-lg shadow-amber-600 p-4 lg:p-5 hover:shadow-lg border transition-all duration-300 ${
                  subscription.isActive ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedSubscription(subscription)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="text-base sm:text-lg lg:text-lg font-semibold text-gray-900">{subscription.name}</h4>
                    <p className="text-xs sm:text-sm lg:text-sm text-gray-600">{subscription.email}</p>
                    <p className="text-xs sm:text-sm lg:text-sm text-gray-600">{new Date(subscription.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(subscription.id, subscription.isActive);
                      }}
                      className={`cursor-pointer p-1.5 sm:p-2 rounded-full ${
                        subscription.isActive ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                      } touch-action-manipulation`}
                      aria-label={`Mark subscription as ${subscription.isActive ? 'inactive' : 'active'}`}
                    >
                      {subscription.isActive ? <FiToggleRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiToggleLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(subscription.id);
                      }}
                      className="cursor-pointer text-red-600 hover:text-red-800 p-1.5 sm:p-2 rounded-full touch-action-manipulation"
                      aria-label={`Delete subscription for ${subscription.email}`}
                    >
                      <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {selectedSubscription && (
          <motion.div
            className="fixed inset-0 bg-[#00000073] backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedSubscription(null)}
          >
            <motion.div
              className="bg-white rounded-xl w-full max-w-md sm:max-w-lg lg:max-w-2xl max-h-[80vh] overflow-y-auto p-4 sm:p-6 lg:p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4 lg:mb-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 truncate">{selectedSubscription.name}</h3>
                <button
                  onClick={() => setSelectedSubscription(null)}
                  className="cursor-pointer text-gray-500 hover:text-red-600 p-1 sm:p-2 rounded-full touch-action-manipulation"
                  aria-label="Close popup"
                >
                  <FiX className="w-5 h-5 sm:w-6 sm:h-6 lg:w-6 lg:h-6" />
                </button>
              </div>
              <div className="space-y-2 text-gray-700 text-sm sm:text-base lg:text-lg">
                <p><span className="font-semibold text-red-600">Name:</span> {selectedSubscription.name}</p>
                <p><span className="font-semibold text-red-600">Email:</span> {selectedSubscription.email}</p>
                <p><span className="font-semibold text-red-600">Subscribed:</span> {new Date(selectedSubscription.createdAt).toLocaleString()}</p>
                <p><span className="font-semibold text-red-600">Status:</span> {selectedSubscription.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => handleToggleActive(selectedSubscription.id, selectedSubscription.isActive)}
                  className={`cursor-pointer flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 ${
                    selectedSubscription.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  } text-white text-sm sm:text-base lg:text-lg rounded-lg transition duration-200 touch-action-manipulation`}
                >
                  {selectedSubscription.isActive ? <FiToggleRight className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiToggleLeft className="w-4 h-4 sm:w-5 sm:h-5" />}
                  <span>{selectedSubscription.isActive ? 'Deactivate' : 'Activate'}</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedSubscription.id)}
                  className="cursor-pointer flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white text-sm sm:text-base lg:text-lg rounded-lg hover:bg-red-700 transition duration-200 touch-action-manipulation"
                >
                  <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminNewsletter;