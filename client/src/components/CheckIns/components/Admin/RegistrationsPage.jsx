import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { API_BASE_URL } from "../../../../../api";
import { FiSearch, FiUpload, FiUserCheck, FiUserX, FiDownload, FiX } from "react-icons/fi";
import QRCode from "qrcode";

function RegistrationsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "fullName", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedRegistrations, setSelectedRegistrations] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const itemsPerPage = 10;

  const fetchWithRetry = async (url, options, retries = 2, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get(url, options);
        return response;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please log in to view registrations");
      }

      const headers = { Authorization: `Bearer ${token}` };
      const query = new URLSearchParams({ eventId });
      if (searchTerm) query.append("search", searchTerm);
      if (filter !== "all") query.append("status", filter);
      const registrationsRes = await fetchWithRetry(
        `${API_BASE_URL}/events/registrations?${query.toString()}`,
        { headers }
      );
      console.log("Registrations data after fetch:", registrationsRes.data); // Debug log
      setRegistrations(registrationsRes.data || []);
    } catch (err) {
      console.error("Error fetching registrations:", err); // Debug log
      const message = err.response?.data?.message || "Failed to load registrations";
      setError(message);
      toast.error(message, {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view registrations", {
            style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
          });
          navigate("/login");
          return;
        }

        if (!eventId || typeof eventId !== "string" || eventId.trim() === "") {
          throw new Error("Invalid event ID");
        }

        const headers = { Authorization: `Bearer ${token}` };
        const eventRes = await fetchWithRetry(`${API_BASE_URL}/events/${eventId}`, { headers });
        setEventTitle(eventRes.data.title || "Unknown Event");

        await fetchRegistrations();
      } catch (err) {
        let message = "Failed to load data";
        if (err.response) {
          if (err.response.status === 401) {
            message = "Session expired. Please log in again.";
            localStorage.removeItem("token");
            navigate("/login");
          } else if (err.response.status === 404) {
            message = "Event not found. Please check the event ID.";
          } else {
            message = err.response.data?.message || err.message;
          }
        } else {
          message = err.message || "Network error";
        }
        setError(message);
        toast.error(message, {
          style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [eventId, navigate, searchTerm, filter]);

  const handleCheckIn = async (registrationId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to update check-in status", {
          style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
        });
        navigate("/login");
        return;
      }

      await axios.patch(
        `${API_BASE_URL}/events/registrations/${registrationId}/checkin`,
        { checkedIn: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRegistrations((prev) =>
        prev.map((reg) =>
          reg.id === registrationId ? { ...reg, checkedIn: !currentStatus } : reg
        )
      );
      toast.success(`Check-in ${!currentStatus ? "marked" : "unmarked"} successfully`, {
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          border: "1px solid #059669",
        },
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update check-in status";
      toast.error(message, {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelectRegistration = (id) => {
    setSelectedRegistrations((prev) =>
      prev.includes(id) ? prev.filter((regId) => regId !== id) : [...prev, id]
    );
  };

  const handleSendEmails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to send emails", {
          style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
        });
        navigate("/login");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/registrations/send-emails`,
        { registrationIds: selectedRegistrations, eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Emails sent to ${selectedRegistrations.length} attendees`, {
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          border: "1px solid #059669",
        },
      });
      setSelectedRegistrations([]);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to send emails";
      toast.error(message, {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
    }
  };

  const handleCsvUpload = async (e) => {
    e.preventDefault();
    if (!fileInputRef.current?.files[0]) {
      setError("No file selected");
      toast.error("No file selected", {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
      return;
    }
    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to upload CSV", {
          style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
        });
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("csv", fileInputRef.current.files[0]);
      formData.append("eventId", eventId);

      const res = await axios.post(`${API_BASE_URL}/events/registrations/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      console.log("CSV upload response:", res.data); // Debug log

      const { processedRows, skippedRows, newAttendees, newRegistrations } = res.data;

      setSuccess(`CSV processed: ${newRegistrations} new registrations, ${newAttendees} new attendees, ${skippedRows} rows skipped`);
      setError("");
      setSearchTerm(""); // Reset search to show all
      setFilter("all"); // Reset filter to show all
      toast.success(`Added ${newRegistrations} new registrations`, {
        style: {
          background: "#10B981",
          color: "#fff",
          borderRadius: "8px",
          border: "1px solid #059669",
        },
      });

      // Add slight delay to ensure database consistency
      await new Promise((resolve) => setTimeout(resolve, 500));
      await fetchRegistrations();

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      const message = err.response?.data?.message || "Failed to upload CSV";
      console.error("CSV upload error:", err); // Debug log
      setError(message);
      setSuccess("");
      toast.error(message, {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const generateQRCode = async (registration) => {
    try {
      const qrCodeData = JSON.stringify({
        attendeeId: registration.attendeeId,
        fullName: registration.fullName,
        email: registration.email,
        eventId,
        eventTitle,
      });
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = `qr_code_${registration.fullName.replace(/\s+/g, "_") || "attendee"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to generate QR code");
      toast.error("Failed to generate QR code", {
        style: { background: "#fff", color: "#1a1a1a", borderRadius: "8px", border: "1px solid #e5e7eb" },
      });
    }
  };

  const openAttendeeModal = (attendee) => {
    setSelectedAttendee(attendee);
    setShowModal(true);
  };

  const closeAttendeeModal = () => {
    setShowModal(false);
    setSelectedAttendee(null);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeAttendeeModal();
    }
  };

  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showModal]);

  const sortedRegistrations = [...registrations].sort((a, b) => {
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";
    if (sortConfig.key === "checkedIn") {
      return sortConfig.direction === "asc"
        ? (a.checkedIn ? 1 : 0) - (b.checkedIn ? 1 : 0)
        : (b.checkedIn ? 1 : 0) - (a.checkedIn ? 1 : 0);
    }
    return sortConfig.direction === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const totalPages = Math.ceil(registrations.length / itemsPerPage);
  const paginatedRegistrations = sortedRegistrations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRowColor = (checkedIn) => {
    return checkedIn ? "bg-green-50 hover:bg-green-100" : "bg-red-50 hover:bg-red-100";
  };

  const getStatusIcon = (checkedIn) => {
    return checkedIn ? (
      <FiUserCheck className="text-green-500" />
    ) : (
      <FiUserX className="text-red-500" />
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const formatArray = (arr) => {
    if (!arr || arr.length === 0) return "None";
    return arr.join(", ");
  };

  const elementVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div className="text-center" variants={elementVariants} initial="hidden" animate="visible">
          <div className="inline-block w-8 h-8 border-4 border-t-[#e62b1e] border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-700">Loading registrations...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      <Toaster position="top-center" />
      <motion.div
        className="container mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
        variants={elementVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-[#e62b1e] p-4 text-white">
          <div className="flex justify-between items-center">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Registrations for {eventTitle}
            </motion.h2>
            <Link
              to={`/events/${eventId}/scan`}
              className="flex items-center bg-white text-[#e62b1e] px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Scan QR Codes
            </Link>
          </div>
        </div>
        <div className="p-6 sm:p-8">
          {error && (
            <motion.div
              className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200"
              variants={elementVariants}
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200"
              variants={elementVariants}
            >
              {success}
            </motion.div>
          )}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e62b1e] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#e62b1e] focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="registered">Registered (Not Checked In)</option>
              <option value="checkedIn">Checked In</option>
            </select>
            <input
              type="file"
              accept=".csv"
              ref={fileInputRef}
              onChange={handleCsvUpload}
              className="hidden"
            />
            <motion.button
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className={`flex items-center px-6 py-2 rounded-lg font-medium ${
                isUploading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#e62b1e] text-white hover:bg-[#c8241a] cursor-pointer"
              } transition-colors`}
              whileHover={!isUploading ? { scale: 1.02 } : {}}
              whileTap={!isUploading ? { scale: 0.98 } : {}}
            >
              <FiUpload className="mr-2" />
              {isUploading ? "Uploading..." : "Upload CSV"}
            </motion.button>
            <motion.button
              onClick={handleSendEmails}
              disabled={selectedRegistrations.length === 0}
              className={`flex items-center px-6 py-2 rounded-lg font-medium ${
                selectedRegistrations.length === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#e62b1e] text-white hover:bg-[#c8241a] cursor-pointer"
              } transition-colors`}
              whileHover={selectedRegistrations.length > 0 ? { scale: 1.02 } : {}}
              whileTap={selectedRegistrations.length > 0 ? { scale: 0.98 } : {}}
            >
              Send Emails to Selected
            </motion.button>
          </div>
          {registrations.length === 0 && !error ? (
            <motion.div
              className="text-center py-12"
              variants={elementVariants}
            >
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-700">
                {searchTerm ? "No matching registrations found" : "No registrations found"}
              </h3>
              <p className="mt-1 text-gray-500 text-sm sm:text-base">
                {searchTerm ? "Try a different search term" : "No attendees have registered for this event yet."}
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                className="overflow-hidden rounded-xl border border-gray-200 shadow-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Select
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("checkedIn")}
                        >
                          Status
                          {sortConfig.key === "checkedIn" && (
                            <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("fullName")}
                        >
                          Full Name
                          {sortConfig.key === "fullName" && (
                            <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("email")}
                        >
                          Email
                          {sortConfig.key === "email" && (
                            <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                          onClick={() => handleSort("phoneNumber")}
                        >
                          Phone Number
                          {sortConfig.key === "phoneNumber" && (
                            <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                          )}
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginatedRegistrations.map((registration) => (
                        <tr
                          key={registration.id}
                          className={`${getRowColor(registration.checkedIn)} transition-colors`}
                        >
                          <td className="px-6 py-4 text-sm">
                            <input
                              type="checkbox"
                              className="accent-red-500 focus:ring-red-500 cursor-pointer"
                              checked={selectedRegistrations.includes(registration.id)}
                              onChange={() => handleSelectRegistration(registration.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">{getStatusIcon(registration.checkedIn)}</div>
                              <div className="ml-2">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    registration.checkedIn
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {registration.checkedIn ? "Checked In" : "Registered"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                            <button
                              onClick={() => openAttendeeModal(registration.attendee)}
                              className="text-black hover:text-[#c8241a] transition-colors cursor-pointer"
                            >
                              {registration.fullName || "N/A"}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                            {registration.email || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">
                            {registration.phoneNumber || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <motion.button
                                onClick={() => generateQRCode(registration)}
                                className="flex items-center text-black hover:text-[#c8241a] transition-colors cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FiDownload className="mr-1" />
                                QR Code
                              </motion.button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
              {totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center">
                  <motion.button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300 text-sm sm:text-base"
                    whileHover={currentPage !== 1 ? { scale: 1.02 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.98 } : {}}
                  >
                    Previous
                  </motion.button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <motion.button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300 text-sm sm:text-base"
                    whileHover={currentPage !== totalPages ? { scale: 1.02 } : {}}
                    whileTap={currentPage !== totalPages ? { scale: 0.98 } : {}}
                  >
                    Next
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Attendee Details Modal */}
      <AnimatePresence>
        {showModal && selectedAttendee && (
          <motion.div
            className="fixed inset-0 bg-[#00000057] backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClickOutside}
            role="dialog"
            aria-labelledby="attendee-modal-title"
          >
            <motion.div
              ref={modalRef}
              className="w-full max-w-md sm:max-w-lg bg-white rounded-3xl border border-red-100 p-6 sm:p-8 max-h-[80vh] overflow-y-auto"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  id="attendee-modal-title"
                  className="text-xl sm:text-2xl font-bold text-[#e62b1e]"
                >
                  Attendee Details
                </h3>
                <button
                  onClick={closeAttendeeModal}
                  className="text-gray-500 hover:text-red-500 cursor-pointer "
                  aria-label="Close modal"
                >
                  <FiX size={24} />
                </button>
              </div>
              <div className="space-y-4 text-gray-700">
                <p><strong>Full Name:</strong> {selectedAttendee.fullName || "N/A"}</p>
                <p><strong>Email:</strong> {selectedAttendee.email || "N/A"}</p>
                <p><strong>Phone Number:</strong> {selectedAttendee.phoneNumber || "N/A"}</p>
                <p><strong>Date of Birth:</strong> {formatDate(selectedAttendee.dateOfBirth)}</p>
                <p><strong>Gender:</strong> {selectedAttendee.gender || "N/A"}</p>
                <p><strong>City/Country:</strong> {selectedAttendee.cityCountry || "N/A"}</p>
                <p><strong>Occupation:</strong> {selectedAttendee.occupation || "N/A"}</p>
                <p><strong>Company/University:</strong> {selectedAttendee.companyUniversity || "N/A"}</p>
                <p><strong>Event Choice:</strong> {selectedAttendee.eventChoice || "N/A"}</p>
                <p><strong>Other Event:</strong> {selectedAttendee.eventOther || "N/A"}</p>
                <p><strong>Reason to Attend:</strong> {selectedAttendee.reasonToAttend || "N/A"}</p>
                <p><strong>Attended Before:</strong> {selectedAttendee.attendedBefore || "N/A"}</p>
                <p><strong>Previous Events:</strong> {selectedAttendee.previousEvents || "N/A"}</p>
                <p><strong>How Heard:</strong> {selectedAttendee.howHeard || "N/A"}</p>
                <p><strong>How Heard (Other):</strong> {selectedAttendee.howHeardOther || "N/A"}</p>
                <p><strong>Dietary Restrictions:</strong> {selectedAttendee.dietaryRestrictions || "N/A"}</p>
                <p><strong>Interests:</strong> {formatArray(selectedAttendee.interests)}</p>
                <p><strong>Interests (Other):</strong> {selectedAttendee.interestsOther || "N/A"}</p>
                <p><strong>Receive Updates:</strong> {selectedAttendee.receiveUpdates || "N/A"}</p>
                <p><strong>Created At:</strong> {formatDate(selectedAttendee.createdAt)}</p>
                <p><strong>Updated At:</strong> {formatDate(selectedAttendee.updatedAt)}</p>
              </div>
              <motion.button
                onClick={closeAttendeeModal}
                className=" cursor-pointer mt-6 w-full bg-[#e62b1e] text-white p-3 rounded-xl font-semibold hover:bg-[#c8241a] transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close attendee details modal"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RegistrationsPage;