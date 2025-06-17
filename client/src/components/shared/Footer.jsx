import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaInstagram, FaLinkedin, FaYoutube, FaFacebook, FaTiktok } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../../api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error('Please enter both name and email address');
      return;
    }
    try {
      await axios.post(`${API_BASE_URL}/newsletter`, { email, name });
      setEmail('');
      setName('');
      toast.success('Subscribed successfully!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to subscribe. Try again later.');
    }
  };
  
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  const actionTexts = [
    {
      action1: 'Know someone for our stage?',
      action2: 'Want to get involved with Us?',
      action3: 'Interested in being a sponsor?',
      newsletter: 'Drop your email and we\'ll keep you posted on all things ',
    },
    {
      action1: 'Have a great speaker in mind?',
      action2: 'Join our team!',
      action3: 'Support our mission as a sponsor!',
      newsletter: 'Stay updated with Our news and events',
    },
    {
      action1: 'Nominate an inspiring voice!',
      action2: 'Volunteer with our community!',
      action3: 'Partner with Us today!',
      newsletter: 'Get the latest updates in your inbox',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActionIndex((prevIndex) => (prevIndex + 1) % actionTexts.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const isFormValid = name.trim() && email.trim();

  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
  };

  return (
    <footer className="relative bg-red-500 text-white text-center py-10 px-6 md:px-20 overflow-hidden rounded-t-[100px]">
      <Toaster />
      <motion.div
        className="hidden md:block absolute inset-0 bg-black/50"
        initial={{ clipPath: 'circle(30% at 0% 50%)' }}
        animate={{
          clipPath: ['circle(30% at 0% 50%)', 'circle(30% at 100% 50%)', 'circle(30% at 0% 50%)'],
        }}
        transition={{ duration: 12, ease: 'easeInOut', repeat: Infinity }}
      />

      <div className="relative z-10 container mx-auto">
        <div className="flex flex-col md:flex-row justify-around items-start gap-8 md:gap-12 mb-8 mt-20">
          {[0, 1, 2].map((i) => (
            <div key={i} className="text-left w-full md:w-[30%] min-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={actionTexts[currentActionIndex][`action${i + 1}`]}
                  className="text-2xl md:text-4xl font-extrabold border-t-6 rounded-2xl pl-4 mb-4 h-20 md:h-24 flex items-center"
                  variants={textVariants} 
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  {actionTexts[currentActionIndex][`action${i + 1}`]}
                </motion.p>
              </AnimatePresence>
              <div className="group flex items-center space-x-2 cursor-pointer text-black font-bold text-lg md:text-2xl pl-4">
                <span>
                  {i === 0
                    ? 'NOMINATE A SPEAKER'
                    : i === 1
                    ? 'BECOME A VOLUNTEER'
                    : 'PARTNER WITH US'}
                </span>
                <motion.div
                  className="transform transition-transform duration-300 group-hover:translate-x-2"
                  whileHover={{ scale: 1.2 }}
                >
                  <FaArrowRight />
                </motion.div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8 mt-20">
          <div className="text-left md:w-1/2">
            <AnimatePresence mode="wait">
              <motion.p
                key={actionTexts[currentActionIndex].newsletter}
                className="text-2xl md:text-5xl font-extrabold border-0 md:border-r-5"
                variants={textVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {actionTexts[currentActionIndex].newsletter}
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="md:w-1/2 w-full">
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col md:flex-row gap-4 justify-end text-xl font-semibold"
            >
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 rounded-full border-2 border-white bg-white/10 text-white placeholder-white/60 backdrop-blur-md shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-full border-2 border-white bg-white/10 text-white placeholder-white/60 backdrop-blur-md shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
                required
              />
              <motion.button
                type="submit"
                className={`px-6 py-2 rounded-full border-white border-2 text-white font-bold backdrop-blur-2xl ${
                  !isFormValid
                    ? 'cursor-not-allowed'
                    : 'cursor-pointer hover:bg-white hover:text-red-500 transition-all duration-300'
                }`}
                disabled={!isFormValid}
                whileHover={isFormValid ? { scale: 1.05 } : {}}
                whileTap={isFormValid ? { scale: 0.95 } : {}}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        <div className="border-2 border-white rounded-full mt-30" />

        <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-6">
          <div className="text-left">
            <div className="flex space-x-4 mb-4">
              <a href="https://www.instagram.com/tedxalgiers" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="text-3xl md:text-4xl text-white hover:text-amber-500 transition-colors duration-300" />
              </a>
              <a href="https://www.linkedin.com/company/ découvirem/tedxalgeria" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-3xl md:text-4xl text-white hover:text-blue-700 transition-colors duration-300" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <FaTiktok className="text-3xl md:text-4xl text-white hover:text-black transition-colors duration-300" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook className="text-3xl md:text-4xl text-white hover:text-blue-600 transition-colors duration-300" />
              </a>
            </div>
            <p className="text-base md:text-lg">Phone: +1-123-456-7890</p>
            <p className="text-base md:text-lg">Email: contact@tedxuoalgiers.com </p>
          </div>

          <div className="flex flex-row flex-wrap md:flex-row gap-4 md:gap-8 text-left text-sm sm:text-base md:text-xl font-bold">
            <div className="flex flex-col space-y-1">
              <a href="/aboutus" className="hover:text-gray-300 hover:underline">About</a>
            </div>
            <div className="flex flex-col space-y-1">
              <a href="/events" className="hover:text-gray-300 hover:underline">Events</a>
              <a href="/contact" className="hover:text-gray-300 hover:underline">ContactUs</a>
            </div>
            <div className="flex flex-col space-y-1">
              <a href="/get-involved" className="hover:text-gray-300 hover:underline">Volunteers</a>
              <a href="/discover-speakers" className="hover:text-gray-300 hover:underline">Speakers</a>
              <a href="/discover-partners" className="hover:text-gray-300 hover:underline">Partners</a>
            </div>
          </div>
        </div>

        <div className="border border-white rounded-full mt-10" />
        <div className="mt-4 -mb-6">
          <a
            href="https://www.softwebelevation.com"
            className="hover:text-gray-200 hover:underline cursor-pointer font-semibold"
            target="_blank"
            rel="noopener noreferrer"
          >
            SoftWebElevation©2025 All rights reserved
          </a>
        </div>
        <div className="border border-white rounded-full mt-10 -mb-10" />
      </div>
    </footer>
  );
};

export default Footer;