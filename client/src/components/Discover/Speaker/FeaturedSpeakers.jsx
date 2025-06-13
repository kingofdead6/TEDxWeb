import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Globe } from 'lucide-react'; // Icons for social media and website
import axios from 'axios';
import { API_BASE_URL } from '../../../../api'; // Adjust path to where your API base URL is defined

const FeaturedSpeakers = () => {
  const sliderRef = useRef(null);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch visible speakers from the backend
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/speakers/visible`, {
          headers: {
            // Optional: Include Authorization header if required
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        console.log('Fetched speakers:', response.data); // Debug: Log API response
        setSpeakers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching speakers:', err);
        setError('Failed to load speakers');
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: false, 
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleMouseEnter = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPause();
    }
  };

  const handleMouseLeave = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPlay();
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Title */}
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
        className="text-5xl sm:text-6xl md:text-6xl font-extrabold text-black mb-20 text-center"
      >
        Featured Speakers:
      </motion.h1>

      {/* Speakers Carousel */}
      <div
        className="relative max-w-full mx-auto"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Fade Gradient Overlays */}
        <div className="absolute inset-y-0 left-0 w-30 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-30 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <svg className="animate-spin h-8 w-8 text-red-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 text-xl font-semibold">
            {error}
          </div>
        ) : speakers.length === 0 ? (
          <div className="text-center text-gray-600 text-xl font-semibold">
            No featured speakers available
          </div>
        ) : (
          <Slider ref={sliderRef} {...settings}>
            {speakers.map((speaker) => (
              <div key={speaker.id} className="px-4 lg:px-6">
                <div className="mx-auto flex flex-col items-center max-w-xs border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="relative w-60 h-60 overflow-hidden rounded-lg">
                    <img
                      src={speaker.pfp || 'https://via.placeholder.com/240?text=Speaker'}
                      alt={speaker.fullName}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        console.warn(`Failed to load image for ${speaker.fullName}: ${speaker.pfp}`); // Debug: Log image errors
                        e.target.src = 'https://via.placeholder.com/240?text=Speaker';
                      }}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-lg font-semibold text-black">{speaker.fullName}</p>
                    <p className="text-md text-gray-600">{speaker.occupation}</p>
                    <div className="mt-2 flex space-x-4 justify-center">
                      {speaker.instagram && (
                        <a href={speaker.instagram} target="_blank" rel="noopener noreferrer">
                          <Instagram className="w-5 h-5 text-gray-600 hover:text-red-600 transition-colors duration-200" />
                        </a>
                      )}
                      {speaker.linkedin && (
                        <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer">
                          <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors duration-200" />
                        </a>
                      )}
                      {speaker.website && (
                        <a href={speaker.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="w-5 h-5 text-gray-600 hover:text-green-600 transition-colors duration-200" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default FeaturedSpeakers;