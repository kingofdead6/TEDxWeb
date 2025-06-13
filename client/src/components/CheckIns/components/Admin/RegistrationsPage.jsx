import { useState, useEffect } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import axios from "axios";
  import { motion } from "framer-motion";
  import { API_BASE_URL } from "../../../../../api";

  function RegistrationsPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [registrations, setRegistrations] = useState([]);
    const [eventTitle, setEventTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: "fullName", direction: "asc" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem("token");
          console.log("Event ID:", eventId);
          console.log("Token:", token ? "Present" : "Missing");
          console.log("API URL:", `${API_BASE_URL}/events/registrations?eventId=${eventId}`);

          if (!token) {
            setError("Please log in to view registrations");
            navigate("/login"); // Adjust path to your login route
            return;
          }

          const registrationsRes = await axios.get(`${API_BASE_URL}/events/registrations?eventId=${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Registrations response:", registrationsRes.data);

          const eventRes = await axios.get(`${API_BASE_URL}/events/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("Event response:", eventRes.data);

          setRegistrations(registrationsRes.data);
          setEventTitle(eventRes.data.title);
          setError("");
        } catch (err) {
          console.error("Fetch error:", err);
          const message = err.response?.data?.message || err.message || "Failed to load registrations";
          setError(message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, [eventId, navigate]);

    const handleSort = (key) => {
      setSortConfig((prev) => ({
        key,
        direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
      }));
    };

    const sortedRegistrations = [...registrations].sort((a, b) => {
      if (sortConfig.key === "checkInStatus") {
        return sortConfig.direction === "asc"
          ? (a.checkedIn ? 1 : 0) - (b.checkedIn ? 1 : 0)
          : (b.checkedIn ? 1 : 0) - (a.checkedIn ? 1 : 0);
      }
      const aValue = a[sortConfig.key] || "";
      const bValue = b[sortConfig.key] || "";
      return sortConfig.direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    const totalPages = Math.ceil(registrations.length / itemsPerPage);
    const paginatedRegistrations = sortedRegistrations.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const elementVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div className="text-center" variants={elementVariants} initial="hidden" animate="visible">
            <div className="inline-block w-8 h-8 border-4 border-t-red-600 border-gray-200 rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-700">Loading registrations...</p>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-screen mt-10 p-4 sm:p-6">
        <motion.div
          className="container mx-auto max-w-5xl bg-white bg-opacity-95 rounded-lg border border-gray-200 overflow-hidden"
          variants={elementVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-red-600 p-4 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold">Registrations for {eventTitle || "Event"}</h2>
          </div>
          <div className="p-6 sm:p-8">
            {error && (
              <motion.div
                className="mb-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm sm:text-base"
                variants={elementVariants}
              >
                {error}
              </motion.div>
            )}
            {registrations.length === 0 && !error ? (
              <motion.div className="text-center py-12" variants={elementVariants}>
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v2h5m-2 0v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-700">No registrations found</h3>
                <p className="mt-1 text-gray-500 text-sm sm:text-base">
                  No attendees have registered for this event yet.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          { key: "fullName", label: "Full Name" },
                          { key: "email", label: "Email" },
                          { key: "phoneNumber", label: "Phone Number" },
                          { key: "checkInStatus", label: "Checked In" },
                        ].map(({ key, label }) => (
                          <th
                            key={key}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort(key)}
                          >
                            {label}
                            {sortConfig.key === key && (
                              <span className="ml-1">
                                {sortConfig.direction === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedRegistrations.map((registration) => (
                        <tr key={registration.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {registration.fullName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registration.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registration.phoneNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {registration.checkedIn ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  export default RegistrationsPage;