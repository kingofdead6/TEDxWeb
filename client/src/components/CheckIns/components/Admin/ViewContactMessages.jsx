import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../api';
import { FiTrash2, FiX, FiSearch, FiArrowUp, FiArrowDown, FiEye, FiEyeOff, FiDownload } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

function ViewContactMessages() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
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

  // Fetch contact messages
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/contacts`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setContacts(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch contact messages');
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact message?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setContacts(contacts.filter((c) => c.id !== id));
      if (selectedContact?.id === id) setSelectedContact(null);
      toast.success('Contact message deleted successfully', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete contact message', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  // Handle mark as seen/unseen
  const handleToggleSeen = async (id, currentStatus) => {
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/contacts/${id}/seen`,
        { isSeen: !currentStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setContacts(contacts.map((c) => (c.id === id ? { ...c, isSeen: !currentStatus } : c)));
      if (selectedContact?.id === id) setSelectedContact({ ...selectedContact, isSeen: !currentStatus });
      toast.success(`Message marked as ${!currentStatus ? 'Responded' : 'Not Responded'}`, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update message status', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  // Handle Excel download
  const handleDownloadExcel = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/contacts/export`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          responseType: 'blob', // Important for handling binary data
        }
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contact_messages.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Contacts exported successfully', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } catch (err) {
      toast.error('Failed to export contacts', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    }
  };

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(
      (c) =>
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 pt-20 pb-12 px-4 sm:px-6">
      <Toaster />
      <motion.div
        className="container mx-auto max-w-6xl bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-red-600">Contact Messages</h2>
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0 w-full sm:w-auto">
            <button
              onClick={toggleSortOrder}
              className="w-full sm:w-auto cursor-pointer flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              aria-label={`Sort ${sortOrder === 'desc' ? 'oldest first' : 'newest first'}`}
            >
              {sortOrder === 'desc' ? <FiArrowDown className="w-5 h-5" /> : <FiArrowUp className="w-5 h-5" />}
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          
            <button
              onClick={handleDownloadExcel}
              className="w-full sm:w-auto cursor-pointer flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
              aria-label="Download contacts as Excel"
            >
              <FiDownload className="w-5 h-5" />
              <span>Download Excel</span>
            </button>
          </div>

        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-10 h-10 border-4 border-t-red-600 border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700">Loading contact messages...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-16 text-gray-600 text-xl font-semibold">
            No contact messages found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <motion.div
                key={contact.id}
                className={`rounded-xl shadow-md p-5 hover:shadow-xl border cursor-pointer transition-all duration-300 ${
                  contact.isSeen ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{contact.fullName}</h4>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    <p className="text-sm text-gray-600">{new Date(contact.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSeen(contact.id, contact.isSeen);
                      }}
                      className={`cursor-pointer p-2 rounded-full ${
                        contact.isSeen ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                      }`}
                      aria-label={`Mark message as ${contact.isSeen ? 'unseen' : 'seen'}`}
                    >
                      {contact.isSeen ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(contact.id);
                      }}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                      aria-label={`Delete message from ${contact.fullName}`}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">{contact.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Popup */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            className="fixed inset-0 bg-[#00000073] backdrop-blur-md flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-red-600">{selectedContact.fullName}</h3>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-500 hover:text-red-600 cursor-pointer"
                  aria-label="Close popup"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-3 text-gray-700">
                <p><span className="font-semibold text-red-600">Email:</span> {selectedContact.email}</p>
                <p><span className="font-semibold text-red-600">Phone:</span> {selectedContact.phoneNumber || 'N/A'}</p>
                <p><span className="font-semibold text-red-600">Organization:</span> {selectedContact.organization || 'N/A'}</p>
                <p><span className="font-semibold text-red-600">Reason:</span> {selectedContact.reason}</p>
                {selectedContact.otherReason && (
                  <p><span className="font-semibold text-red-600">Other Reason:</span> {selectedContact.otherReason}</p>
                )}
                <p><span className="font-semibold text-red-600">Message:</span> {selectedContact.message}</p>
                <p><span className="font-semibold text-red-600">Preferred Contact:</span> {selectedContact.preferredContact}</p>
                <p><span className="font-semibold text-red-600">Heard About Us:</span> {selectedContact.hearAboutUs}</p>
                {selectedContact.otherHear && (
                  <p><span className="font-semibold text-red-600">Other Source:</span> {selectedContact.otherHear}</p>
                )}
                <p><span className="font-semibold text-red-600">Submitted:</span> {new Date(selectedContact.createdAt).toLocaleString()}</p>
                <p><span className="font-semibold text-red-600">Status:</span> {selectedContact.isSeen ? 'Responded' : 'Not Responded'}</p>
              </div>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => handleToggleSeen(selectedContact.id, selectedContact.isSeen)}
                  className={`cursor-pointer px-4 py-2 ${
                    selectedContact.isSeen ? 'bg-red-600 hover:bg-red-700':'bg-green-600 hover:bg-green-700' 
                  } text-white rounded-lg transition duration-200 flex items-center space-x-2`}
                >
                  {selectedContact.isSeen ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  <span>Mark as {selectedContact.isSeen ? 'Not Responded' : 'Responded'}</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 flex items-center space-x-2"
                >
                  <FiTrash2 className="w-5 h-5" />
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

export default ViewContactMessages;