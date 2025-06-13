/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 
import handshake from '/SpeakersBack.jpg';

const BecomeSpeaker = () => {
  const navigate = useNavigate(); 

  const handleButtonClick = () => {
    navigate('/speaker-form'); 
  };

  return (
    <section
      className="my-40 relative w-full h-[800px] bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${handshake})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[#EB0028C9] via-[#EB002884] to-transparent backdrop-blur-md"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 50, damping: 10 }}
          className="text-6xl sm:text-7xl md:text-7xl font-bold max-w-6xl"
        >
          You want or you know someone who should share their idea on the stage?
        </motion.h1>
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 50, damping: 10 }}
          className="mt-12 px-10 py-2 bg-[#00000000] text-white border-yellow-600 border-2 text-2xl cursor-pointer rounded-full font-semibold hover:bg-[#EFB87A] hover:text-black transition-colors duration-300"
          onClick={handleButtonClick} 
        >
          Become a Speaker
        </motion.button>
      </div>
    </section>
  );
};

export default BecomeSpeaker;