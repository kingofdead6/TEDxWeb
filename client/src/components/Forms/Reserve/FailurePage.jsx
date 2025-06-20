import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function FailurePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-md mx-auto text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black mb-4">
          Payment Failed
        </h1>
        <p className="text-lg sm:text-xl text-black mb-6">
          Unfortunately, your payment could not be processed. Please try again or contact support.
        </p>
        <motion.button
          onClick={() => navigate(`/registration/${new URLSearchParams(window.location.search).get('registrationId')}`)}
          className="inline-block bg-red-600 text-white px-6 py-3 rounded-full font-medium hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
        <p className="text-sm text-black mt-4">
          For assistance, reach us at <a href="mailto:contact@tedxuoalgiers.com" className="text-red-600 hover:underline">contact@tedxuoalgiers.com</a>
        </p>
      </motion.div>
    </div>
  );
};