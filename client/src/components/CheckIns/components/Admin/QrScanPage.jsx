import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import QrScanner from 'qr-scanner';
import { API_BASE_URL } from '../../../../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';

function QrScanPage() {
  const { eventId } = useParams();
  const [scanResult, setScanResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [registrationId, setRegistrationId] = useState(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && !scannerRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => handleScan(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment',
        }
      );

      if (isScanning) {
        scannerRef.current.start().catch((err) => {
          console.error('Scanner start error:', err);
          toast.error('Failed to start scanner. Please check camera permissions.', {
            style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
          });
          setIsScanning(false);
        });
      }
    }

    return () => {
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
          scannerRef.current.destroy();
        } catch (err) {
          console.warn('Error stopping scanner:', err);
        }
        scannerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (scannerRef.current) {
      if (isScanning) {
        scannerRef.current.start().catch((err) => {
          console.error('Scanner start error:', err);
          toast.error('Failed to start scanner. Please check camera permissions.', {
            style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
          });
          setIsScanning(false);
        });
      } else {
        try {
          scannerRef.current.stop();
        } catch (err) {
          console.warn('Error stopping scanner:', err);
        }
      }
    }
  }, [isScanning]);

  const handleScan = async (data) => {
    if (!data || isLoading) return;

    setIsLoading(true);
    setIsScanning(false);

    console.log('Scanned QR code data:', data); // Debug log

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to validate QR code");
      }

      const response = await axios.post(
        `${API_BASE_URL}/events/registrations/validate`,
        { qrCodeData: data, eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Validation response:', response.data); // Debug log

      const { valid, checkedIn, message, attendee, registrationId } = response.data;

      if (!valid) {
        setScanResult({ valid: false, message });
        return;
      }

      setScanResult({
        valid: true,
        checkedIn,
        message,
        attendee,
      });

      if (!checkedIn && registrationId) {
        setRegistrationId(registrationId);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error validating QR code';
      console.error('Validation error:', err.response?.data || err); // Debug log
      setScanResult({ valid: false, message });
      toast.error(message, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCheckIn = async () => {
    if (!registrationId) {
      toast.error('No registration ID available for check-in', {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to confirm check-in");
      }

      const response = await axios.post(
        `${API_BASE_URL}/events/registrations/confirm-checkin`,
        { registrationId, eventId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Confirm check-in response:', response.data); // Debug log

      const { valid, checkedIn, message, attendee } = response.data;

      if (valid && checkedIn) {
        setScanResult({
          valid: true,
          checkedIn: true,
          message: 'Attendee checked in successfully',
          attendee,
        });
        setRegistrationId(null);
        toast.success('Check-in confirmed', {
          style: {
            background: '#10B981',
            color: '#fff',
            borderRadius: '8px',
            border: '1px solid #059669',
          },
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Error confirming check-in';
      console.error('Confirm check-in error:', err.response?.data || err); // Debug log
      toast.error(message, {
        style: { background: '#fff', color: '#1a1a1a', borderRadius: '8px', border: '1px solid #e5e7eb' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setScanResult(null);
    setRegistrationId(null);
    setIsScanning(true);
  };

  const scanAgain = () => {
    setScanResult(null);
    setRegistrationId(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <Toaster position="top-center" />
      <motion.div
        className="container mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-[#e62b1e] p-4 text-white">
          <div className="flex justify-between items-center">
            <motion.h2
              className="text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              QR Code Scanner
            </motion.h2>
            <Link
              to={`/checkins/events/${eventId}/registrations`}
              className="flex items-center bg-white text-[#e62b1e] px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              View Registrations
            </Link>
          </div>
        </div>

        <div className="p-6">
          <motion.div
            className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">Scan Attendee QR Code</h3>

            <div className="relative aspect-square max-w-md mx-auto">
              <div className="w-full h-full">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover rounded-md shadow-lg"
                />
              </div>

              {isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e62b1e]"></div>
                </div>
              )}
            </div>

            <div className="mt-4 text-center text-gray-500">
              <p>Point your camera at a QR code to scan it</p>
            </div>
          </motion.div>

          <motion.div
            className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              How to use the scanner
            </h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Ensure the QR code is clearly visible in the frame</li>
              <li>Hold steady for a few seconds to allow scanning</li>
              <li>Good lighting conditions improve scanning accuracy</li>
              <li>Click "Scan Again" after each scan to continue</li>
            </ul>
          </motion.div>
        </div>

        <AnimatePresence>
          {scanResult && (
            <motion.div
              className="fixed inset-0 bg-[#0000004e] backdrop-blur-md flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className={`p-6 rounded-xl shadow-2xl max-w-md w-full ${
                  scanResult.valid && !scanResult.checkedIn
                    ? 'bg-green-50 border-green-200'
                    : scanResult.valid
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                } border-2 relative`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-start mb-4">
                  <div
                    className={`p-2 rounded-full ${
                      scanResult.valid && !scanResult.checkedIn
                        ? 'bg-green-100 text-green-600'
                        : scanResult.valid
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {scanResult.valid && !scanResult.checkedIn ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : scanResult.valid ? (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01M12 2a10 10 0 110 20 10 10 0 010-20z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3
                      className={`text-lg font-bold ${
                        scanResult.valid && !scanResult.checkedIn
                          ? 'text-green-800'
                          : scanResult.valid
                          ? 'text-yellow-800'
                          : 'text-red-800'
                      }`}
                    >
                      {scanResult.valid && !scanResult.checkedIn
                        ? 'QR Code Valid'
                        : scanResult.valid
                        ? 'Already Checked In'
                        : 'Invalid QR Code'}
                    </h3>
                    <p
                      className={`text-sm ${
                        scanResult.valid && !scanResult.checkedIn
                          ? 'text-green-600'
                          : scanResult.valid
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}
                    >
                      {scanResult.message}
                    </p>
                  </div>
                </div>

                {scanResult.valid && scanResult.attendee && (
                  <div className="mt-4 space-y-2">
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">
                        ATTENDEE DETAILS
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-1">
                          <p className="text-xs font-medium text-gray-500 capitalize">Full Name</p>
                          <p className="text-sm font-medium">{scanResult.attendee.fullName || 'N/A'}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-xs font-medium text-gray-500 capitalize">Email</p>
                          <p className="text-sm font-medium">{scanResult.attendee.email || 'N/A'}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-xs font-medium text-gray-500 capitalize">Phone Number</p>
                          <p className="text-sm font-medium">{scanResult.attendee.phoneNumber || 'N/A'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500">Status</p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            scanResult.attendee.checkedIn
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {scanResult.attendee.checkedIn ? 'Checked In' : 'Registered'}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">Check-In Time</p>
                        <p className="text-sm">
                          {scanResult.attendee.checkInTime
                            ? new Date(scanResult.attendee.checkInTime).toLocaleString()
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-2">
                  {scanResult.valid && !scanResult.checkedIn && (
                    <motion.button
                      onClick={handleConfirmCheckIn}
                      className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Confirming...' : 'Confirm Check-In'}
                    </motion.button>
                  )}
                  <motion.button
                    onClick={scanAgain}
                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Scan Again
                  </motion.button>
                  <motion.button
                    onClick={closePopup}
                    className="cursor-pointer px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default QrScanPage;