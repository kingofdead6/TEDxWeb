import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../api';

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [team, setTeam] = useState('');
  const [roleInTeam, setRoleInTeam] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/checkins/login');
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.role !== 'admin') {
          setError('Only admins can register new users');
          navigate('/checkins/login');
        } else {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Admin check error:', err.response?.data);
        setError('Authentication failed');
        navigate('/checkins/login');
      }
    };
    checkAdmin();
  }, [navigate]);

  // Password validation checks
  const isPasswordValid = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  // Form validation
  const isFormValid =
    name.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    password.trim() !== '' &&
    team !== '' &&
    roleInTeam.trim() !== '' &&
    isPasswordValid.length &&
    isPasswordValid.uppercase &&
    isPasswordValid.number;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        phone,
        password,
        team,
        roleInTeam,
        role: 'user'
      });
      // Clear form fields
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setTeam('');
      setRoleInTeam('');
      // Show success message
      setSuccess('User added successfully');
      setError('');
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const cardVariants = {
    initial: { scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    hover: { 
      scale: 1.05, 
      boxShadow: '0 10px 20px rgba(210, 0, 0, 0.3)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };

  const messageVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  if (!isAdmin && error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.p
          className="text-red-900 text-center text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-sm sm:max-w-md bg-white bg-opacity-95 rounded-3xl border border-red-100 p-6 sm:p-8"
        initial="initial"
        whileHover="hover"
        variants={cardVariants}
      >
        <motion.h2 
          className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-[#d20000]"
          variants={formVariants}
        >
          Register New User
        </motion.h2>
        <AnimatePresence>
          {success && (
            <motion.p 
              className="text-green-600 text-center mb-4 text-sm sm:text-base"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {success}
            </motion.p>
          )}
          {error && (
            <motion.p 
              className="text-red-900 text-center mb-4 text-sm sm:text-base"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={formVariants}>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300"
              required
              aria-required="true"
            />
          </motion.div>
          <motion.div variants={formVariants}>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300"
              required
              aria-required="true"
            />
          </motion.div>
          <motion.div variants={formVariants}>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-800 mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300"
              required
              aria-required="true"
            />
          </motion.div>
          <motion.div variants={formVariants}>
            <label htmlFor="team" className="block text-sm font-semibold text-gray-800 mb-1">
              Team
            </label>
            <input
              id="team"
              type='text'
              placeholder='Enter team name'
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300"
              required
              aria-required="true"
            />
          </motion.div>
          <motion.div variants={formVariants}>
            <label htmlFor="roleInTeam" className="block text-sm font-semibold text-gray-800 mb-1">
              Role in Team
            </label>
            <input
              id="roleInTeam"
              type="text"
              value={roleInTeam}
              onChange={(e) => setRoleInTeam(e.target.value)}
              placeholder="Enter role in team"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300"
              required
              aria-required="true"
            />
          </motion.div>
          <motion.div variants={formVariants}>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300"
                required
                aria-required="true"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#d20000] transition duration-200 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-2 text-xs sm:text-sm space-y-1">
              <p className={`flex items-center ${isPasswordValid.length ? 'text-green-600' : 'text-red-600'}`}>
                {isPasswordValid.length ? '✔' : '✘'} At least 8 characters
              </p>
              <p className={`flex items-center ${isPasswordValid.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                {isPasswordValid.uppercase ? '✔' : '✘'} Contains an uppercase letter
              </p>
              <p className={`flex items-center ${isPasswordValid.number ? 'text-green-600' : 'text-red-600'}`}>
                {isPasswordValid.number ? '✔' : '✘'} Contains a number
              </p>
            </div>
          </motion.div>
          <motion.div variants={formVariants}>
            <motion.button
              type="submit"
              className="cursor-pointer w-full bg-[#d20000] text-white p-3 rounded-xl hover:bg-red-800 text-lg font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid}
              variants={buttonVariants}
              whileHover={isFormValid ? 'hover' : ''}
            >
              Register User
            </motion.button>
          </motion.div>
        </form>
        <motion.p 
          className="text-center text-sm text-gray-600 mt-5"
          variants={formVariants}
        >
          Manage existing users?{' '}
          <Link to="/checkins/admin/users" className="text-[#d20000] hover:underline font-semibold">
            Go to Users
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}

export default RegisterForm;