
import React, { useRef, useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../../../../api'; // Adjust path as needed

const OurPartners = () => {
  const sliderRef = useRef(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch visible partners from the backend
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/partners/visible`, {
          headers: {
            // Optional: Include Authorization header if required
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        console.log('Fetched partners:', response.data); // Debug: Log API response
        setPartners(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching partners:', err);
        setError('Failed to load partners');
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
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
    <section className="relative py-20 overflow-hidden mt-20">
      {/* Heading */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
        }}
        initial="hidden"
        animate="visible"
        className="text-center relative px-4 mb-16"
      >
        <h2 className="text-5xl sm:text-6xl md:text-6xl font-extrabold text-black">
          Our Valued Partners
        </h2>
      </motion.div>

      {/* Partners Carousel */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative max-w-full mx-auto"
      >
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-100 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-100 to-transparent z-10 pointer-events-none" />

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
        ) : partners.length === 0 ? (
          <div className="text-center text-gray-600 text-xl font-semibold">
            No partners available
          </div>
        ) : (
          <Slider ref={sliderRef} {...settings}>
            {partners.map((partner) => (
              <motion.div
                key={partner.id}
                className="px-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="mx-auto flex flex-col justify-center items-center max-w-xs">
                  <div className="w-32 h-32 rounded-lg overflow-hidden mb-2 transition-transform duration-200 hover:scale-105">
                    {partner.companyProfile ? (
                      <img
                        src={partner.companyProfile}
                        alt={`${partner.organizationName} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.warn(`Failed to load image for ${partner.organizationName}: ${partner.companyProfile}`); // Debug: Log image errors
                          e.target.src = 'https://via.placeholder.com/128?text=Logo';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500 text-sm">
                        No Logo
                      </div>
                    )}
                  </div>
                  <p className="text-xl font-semibold text-black text-center">
                    {partner.organizationName}
                  </p>
                </div>
              </motion.div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default OurPartners;
