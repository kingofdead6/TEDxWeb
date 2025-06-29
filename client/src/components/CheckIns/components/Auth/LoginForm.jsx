import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../../../api';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Check if form is valid (all fields filled)
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return; // Prevent submission if form is invalid
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user } = res.data;
      console.log('Login response:', { token, user });
      localStorage.setItem('token', token);
      if (user.role === 'admin') {
        console.log('Redirecting to admin dashboard');
        navigate('/checkins/admin/users', { replace: true });
      } else {
        console.log('Redirecting to events');
        navigate('/checkins/events', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Animation variants for form elements
  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8, 
        ease: 'easeOut' 
      }
    }
  };

  // Animation variants for card hover
  const cardVariants = {
    initial: { scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    hover: { 
      scale: 1.05, 
      boxShadow: '0 10px 20px rgba(210, 0, 0, 0.3)',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  // Animation for button hover
  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      transition: { duration: 0.2 }
    }
  };

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
          Login to the main dashboard
        </motion.h2>
        {error && (
          <motion.p 
            className="text-red-900 text-center mb-4 text-sm sm:text-base"
            variants={formVariants}
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={formVariants}>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300"
              required
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
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff7b7b] focus:border-[#ff7b7b] transition duration-300"
                required
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
          </motion.div>
          <motion.div variants={formVariants}>
            <motion.button
              type="submit"
              className="w-full bg-[#d20000] text-white p-3 rounded-xl cursor-pointer hover:bg-red-800 text-base sm:text-lg font-semibold transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isFormValid}
              variants={buttonVariants}
              whileHover={isFormValid ? 'hover' : {}}
            >
              Login
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginForm;