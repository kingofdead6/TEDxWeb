import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../api';

function Navbar() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Navbar fetch user error:', err.response?.data);
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
      }
    };
    fetchUser();
  }, [navigate]);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsSidebarOpen(false);
    navigate('/');
  };

  // Animation variants
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
    closed: {
      x: '100%',
      opacity: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      color: '#ffffff',
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  };

  // Determine if on main page
  const isMainPage = location.pathname === '/';

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-50/95 to-gray-50/95 backdrop-blur-md text-black text-base sm:text-lg p-4 shadow-md border-b border-red-100"
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <motion.div variants={linkVariants} whileHover="hover">
            <Link
              to="/checkins"
              className="bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-300 font-semibold"
            >
              TEDx Check-ins
            </Link>
          </motion.div>

          {/* Hamburger Button */}
          <button
            className="cursor-pointer flex flex-col justify-center items-center w-8 h-8 space-y-1.5"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <span
              className={`w-8 h-1 bg-[#e62b1e] transition-transform duration-300 ${
                isSidebarOpen ? 'rotate-45 translate-y-2.5' : ''
              }`}
            ></span>
            <span
              className={`w-8 h-1 bg-[#e62b1e] ${isSidebarOpen ? 'opacity-0' : ''}`}
            ></span>
            <span
              className={`w-8 h-1 bg-[#e62b1e] transition-transform duration-300 ${
                isSidebarOpen ? '-rotate-45 -translate-y-2.5' : ''
              }`}
            ></span>
          </button>
        </div>
      </motion.nav>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-[#00000042] z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
            />

            {/* Sidebar Content */}
            <motion.div
              className="fixed top-0 right-0 h-full w-64 bg-gray-50 bg-opacity-95 rounded-l-xl shadow-lg z-50 p-6 flex flex-col space-y-4"
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
            >
              {/* Close Button */}
              <button
                className="cursor-pointer self-end text-[#e62b1e] hover:text-red-700 transition-colors duration-200"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Sidebar Links */}
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <div className="flex flex-col space-y-2">
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/admin/events"
                          className="block bg-transparent border-2 border-[#e62b1e] hover:bg-[#e62b1e] rounded-xl px-4 py-2  hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Manage Events
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/admin/events/add"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Add Event
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/admin/users"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Manage Users
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/admin/statistics"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Statistics
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/admin/participants/add"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Add People
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/admin/participants/view"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          View People
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/admin/contacts"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Contact Messages
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/admin/newsletter"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Newsletter
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/register"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Register
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer block w-full bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                        >
                          Logout
                        </button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/events"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Events
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <Link
                          to="/checkins/profile"
                          className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                          onClick={toggleSidebar}
                        >
                          Profile
                        </Link>
                      </motion.div>
                      <motion.div variants={linkVariants} whileHover="hover">
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer block w-full bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                        >
                          Logout
                        </button>
                      </motion.div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <motion.div variants={linkVariants} whileHover="hover">
                    <Link
                      to="/checkins/login"
                      className="block bg-transparent border-2 border-[#e62b1e] rounded-xl px-4 py-2 hover:bg-[#e62b1e] hover:text-white transition-colors duration-200 text-center"
                      onClick={toggleSidebar}
                    >
                      Login
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {!isMainPage && <div className="h-16" />}
    </>
  );
}

export default Navbar;