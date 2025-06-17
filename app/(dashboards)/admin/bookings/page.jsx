"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CalendarIcon,
  UserIcon,
  BuildingOfficeIcon,
  FunnelIcon,
  ChartBarIcon,
  ClockIcon,
  CheckIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const mockBookings = [
  {
    id: 1,
    bookingId: 69,
    passengerName: "Newton Passenger 445",
    tripDate: "2025-06-15T19:00:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 2,
    bookingId: 47,
    passengerName: "Dennis Mwebia",
    tripDate: "2025-06-12T15:02:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 3,
    bookingId: 45,
    passengerName: "Newton Passenger 445",
    tripDate: "2025-06-10T12:25:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 4,
    bookingId: 37,
    passengerName: "Newton Passenger 445",
    tripDate: "2025-06-10T09:55:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 5,
    bookingId: 36,
    passengerName: "Newton Passenger 445",
    tripDate: "2025-06-10T09:50:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 6,
    bookingId: 35,
    passengerName: "Newton Passenger 445",
    tripDate: "2025-06-10T00:20:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 7,
    bookingId: 29,
    passengerName: "Dennis Mwebia",
    tripDate: "2025-06-04T00:50:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 8,
    bookingId: 25,
    passengerName: "Christian Nash",
    tripDate: "2025-05-30T00:45:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 9,
    bookingId: 24,
    passengerName: "Christian Nash",
    tripDate: "2025-05-30T00:45:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 10,
    bookingId: 23,
    passengerName: "Christian Nash",
    tripDate: "2025-05-30T00:10:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "PENDING",
  },
  {
    id: 11,
    bookingId: 76,
    passengerName: "Dennis Mwebia",
    tripDate: "2025-06-17T14:25:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "COMPLETED",
  },
  {
    id: 12,
    bookingId: 75,
    passengerName: "Chris Nash",
    tripDate: "2025-06-16T11:22:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "COMPLETED",
  },
  {
    id: 13,
    bookingId: 74,
    passengerName: "Chris Nash",
    tripDate: "2025-06-16T11:08:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "APPROVED",
  },
  {
    id: 14,
    bookingId: 73,
    passengerName: "Chris Nash",
    tripDate: "2025-06-16T10:14:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "COMPLETED",
  },
  {
    id: 15,
    bookingId: 72,
    passengerName: "Chris Nash",
    tripDate: "2025-06-16T10:05:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "COMPLETED",
  },
  {
    id: 16,
    bookingId: 71,
    passengerName: "Chris Nash",
    tripDate: "2025-06-16T09:43:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "COMPLETED",
  },
  {
    id: 17,
    bookingId: 70,
    passengerName: "Chris Nash",
    tripDate: "2025-06-16T09:35:00Z",
    client: "UN Nairobi office",
    stopOvers: 0,
    status: "COMPLETED",
  },
  {
    id: 18,
    bookingId: 68,
    passengerName: "Christian Nash",
    tripDate: "2025-06-15T17:08:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "APPROVED",
  },
  {
    id: 19,
    bookingId: 67,
    passengerName: "Christian Nash",
    tripDate: "2025-06-15T17:01:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "APPROVED",
  },
  {
    id: 20,
    bookingId: 66,
    passengerName: "Christian Nash",
    tripDate: "2025-06-15T16:39:00Z",
    client: "UN Isiolo Office",
    stopOvers: 0,
    status: "APPROVED",
  },
];

// Mock API function
const fetchBookings = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockBookings;
};

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    passengerName: "",
    client: "",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "tripDate",
    direction: "desc",
  });
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState("new"); // "new" or "processed"
  const rowsPerPage = 10;

  // Fetch bookings on mount
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        setBookings(data);
        setFilteredBookings(data.filter((b) => b.status === "PENDING"));
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  // Apply filters, sorting, and view mode
  useEffect(() => {
    let filtered = bookings.filter((booking) => {
      const tripDate = new Date(booking.tripDate);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (viewMode === "new"
          ? booking.status === "PENDING"
          : booking.status !== "PENDING") &&
        (filters.passengerName === "" ||
          booking.passengerName
            .toLowerCase()
            .includes(filters.passengerName.toLowerCase())) &&
        (filters.client === "" ||
          booking.client
            .toLowerCase()
            .includes(filters.client.toLowerCase())) &&
        (filters.status === "" || booking.status === filters.status) &&
        (!startDate || tripDate >= startDate) &&
        (!endDate || tripDate <= endDate)
      );
    });

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortConfig.key === "tripDate") {
        return sortConfig.direction === "asc"
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      }
      return sortConfig.direction === "asc"
        ? a[sortConfig.key]
            .toString()
            .localeCompare(b[sortConfig.key].toString())
        : b[sortConfig.key]
            .toString()
            .localeCompare(a[sortConfig.key].toString());
    });

    setFilteredBookings(filtered);
    setPage(0);
  }, [bookings, filters, sortConfig, viewMode]);

  // Calculate summary metrics
  const metrics = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
    approved: bookings.filter((b) => b.status === "APPROVED").length,
    completed: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  // Handle sorting
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Render metric card
  const MetricCard = ({ title, count, color, icon: Icon }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex items-center gap-4 ${color}`}
    >
      <div className="p-3 rounded-full bg-opacity-10 bg-current">
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-current" />
      </div>
      <div>
        <h4 className="text-sm sm:text-base font-medium text-gray-600">
          {title}
        </h4>
        <p className="text-lg sm:text-2xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  );

  // Render table
  const renderTable = () => {
    const pageCount = Math.ceil(filteredBookings.length / rowsPerPage);
    const pages = Array.from({ length: pageCount }, (_, i) => i);

    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-4 sm:p-6">
          {/* Toggler */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setViewMode("new")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === "new"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              New Bookings
            </button>
            <button
              onClick={() => setViewMode("processed")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                viewMode === "processed"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Processed Bookings
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "#",
                    "Booking Id",
                    "Passenger Name",
                    "Trip Date",
                    "Client",
                    "Stop Overs",
                    "Status",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
                      onClick={() =>
                        header !== "#" &&
                        handleSort(
                          header
                            .toLowerCase()
                            .replace(" ", "")
                            .replace("status", "status")
                        )
                      }
                    >
                      <div className="flex items-center">
                        {header}
                        {sortConfig.key ===
                          header
                            .toLowerCase()
                            .replace(" ", "")
                            .replace("status", "status") && (
                          <span className="ml-1">
                            {sortConfig.direction === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((booking, index) => (
                    <tr
                      key={booking.id}
                      className={`transition duration-300 ease-in-out ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-indigo-50`}
                    >
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                        {page * rowsPerPage + index + 1}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                        {booking.bookingId}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                        {booking.passengerName}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                        {new Date(booking.tripDate).toLocaleString()}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                        {booking.client}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                        {booking.stopOvers}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "APPROVED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 gap-4 border-t border-gray-200">
          <div className="text-sm sm:text-base text-gray-600">
            Showing {page * rowsPerPage + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, filteredBookings.length)} of{" "}
            {filteredBookings.length} bookings
          </div>
          <div className="flex gap-1 flex-wrap justify-center">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base rounded-lg ${
                  page === p
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-indigo-50"
                }`}
              >
                {p + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Bookings Management
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Monitor and review bookings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Total Bookings"
            count={metrics.total}
            color="text-indigo-600"
            icon={ChartBarIcon}
          />
          <MetricCard
            title="Pending Bookings"
            count={metrics.pending}
            color="text-yellow-600"
            icon={ClockIcon}
          />
          <MetricCard
            title="Approved Bookings"
            count={metrics.approved}
            color="text-blue-600"
            icon={ShieldCheckIcon}
          />
          <MetricCard
            title="Completed Bookings"
            count={metrics.completed}
            color="text-green-600"
            icon={CheckIcon}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passenger Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by passenger name..."
                  value={filters.passengerName}
                  onChange={(e) =>
                    setFilters({ ...filters, passengerName: e.target.value })
                  }
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client
              </label>
              <div className="relative">
                <BuildingOfficeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by client..."
                  value={filters.client}
                  onChange={(e) =>
                    setFilters({ ...filters, client: e.target.value })
                  }
                  className="pl-10 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300"
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() =>
                  setFilters({
                    passengerName: "",
                    client: "",
                    startDate: "",
                    endDate: "",
                    status: "",
                  })
                }
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
              ></path>
            </svg>
          </div>
        ) : (
          renderTable()
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
