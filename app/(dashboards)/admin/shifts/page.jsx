"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  BriefcaseIcon,
  ClockIcon,
  PauseIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// Mock shift data (50 drivers)
const mockShifts = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  driverName: `Driver ${i + 1}`,
  vehicleAllocated: `Car ${String.fromCharCode(65 + (i % 26))}`,
  jobsDone: Math.floor(Math.random() * 15) + 1,
  status: ["Active", "Inactive", "On Break"][Math.floor(Math.random() * 3)],
  breaks: Math.floor(Math.random() * 120),
  timeStarted: `2025-06-15T${String(
    Math.floor(Math.random() * 12) + 6
  ).padStart(2, "0")}:00`,
  timeEnded: `2025-06-15T${String(Math.floor(Math.random() * 12) + 12).padStart(
    2,
    "0"
  )}:00`,
  totalTimeOnline: `${Math.floor(Math.random() * 8) + 4}h`,
}));

// Mock API function
const fetchShifts = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockShifts;
};

const Shifts = () => {
  const [shifts, setShifts] = useState([]);
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(null);
  const [topFilter, setTopFilter] = useState("all"); // Top 5, 10, 20, or all
  const [showUnderperformers, setShowUnderperformers] = useState(false); // Underperformers filter
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const rowsPerPage = 10; // Updated to 10 rows per page

  // Fetch shifts on mount
  useEffect(() => {
    const loadShifts = async () => {
      try {
        const data = await fetchShifts();
        setShifts(data);
        setFilteredShifts(data);
      } catch (error) {
        console.error("Error fetching shifts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadShifts();
  }, []);

  // Handle all filters
  useEffect(() => {
    let filtered = [...shifts];

    // Apply search filter
    if (search) {
      filtered = filtered.filter((shift) =>
        shift.driverName.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((shift) => shift.status === statusFilter);
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (shift) =>
          new Date(shift.timeStarted).toDateString() ===
          dateFilter.toDateString()
      );
    }

    // Apply underperformers filter
    if (showUnderperformers) {
      const avgJobs =
        filtered.reduce((sum, shift) => sum + shift.jobsDone, 0) /
          filtered.length || 0;
      filtered = filtered.filter((shift) => shift.jobsDone < avgJobs);
      // Sort underperformers ascending (poorest first) if topFilter is applied
      if (topFilter !== "all") {
        filtered = filtered
          .sort((a, b) => a.jobsDone - b.jobsDone)
          .slice(0, parseInt(topFilter));
      }
    } else if (topFilter !== "all") {
      // Apply top performers filter (descending) if not underperformers
      filtered = filtered
        .sort((a, b) => b.jobsDone - a.jobsDone)
        .slice(0, parseInt(topFilter));
    }

    // Apply table sorting (if a column is sorted)
    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === "asc") {
          return aValue.toString().localeCompare(bValue.toString());
        }
        return bValue.toString().localeCompare(aValue.toString());
      });
    }

    setFilteredShifts(filtered);
    setPage(0);
  }, [
    search,
    statusFilter,
    dateFilter,
    topFilter,
    showUnderperformers,
    sortConfig,
    shifts,
  ]);

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFilter(null);
    setTopFilter("all");
    setShowUnderperformers(false);
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredShifts);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Shifts");
    XLSX.writeFile(workbook, "shifts_export.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Jim Cab Shifts Report", 14, 20);

    doc.autoTable({
      startY: 30,
      head: [
        [
          "Driver Name",
          "Vehicle Allocated",
          "Jobs Done",
          "Status",
          "Breaks (min)",
          "Time Started",
          "Time Ended",
          "Total Time Online",
        ],
      ],
      body: filteredShifts.map((shift) => [
        shift.driverName,
        shift.vehicleAllocated,
        shift.jobsDone,
        shift.status,
        shift.breaks,
        new Date(shift.timeStarted).toLocaleString(),
        new Date(shift.timeEnded).toLocaleString(),
        shift.totalTimeOnline,
      ]),
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { cellPadding: 3, fontSize: 10 },
    });

    doc.save("shifts_export.pdf");
  };

  // Handle pagination
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Map header to sort key
  const headerToKey = {
    "Driver Name": "driverName",
    "Vehicle Allocated": "vehicleAllocated",
    "Jobs Done": "jobsDone",
    Status: "status",
    "Breaks (min)": "breaks",
    "Time Started": "timeStarted",
    "Time Ended": "timeEnded",
    "Total Time Online": "totalTimeOnline",
  };

  // Calculate page numbers
  const pageCount = Math.ceil(filteredShifts.length / rowsPerPage);
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  // Summary statistics
  const totalJobs = filteredShifts.reduce(
    (sum, shift) => sum + shift.jobsDone,
    0
  );
  const activeDrivers = filteredShifts.filter(
    (shift) => shift.status === "Active"
  ).length;
  const avgJobsPerActiveDriver = (totalJobs / activeDrivers || 0).toFixed(1);
  const totalOnlineHours = filteredShifts
    .reduce((sum, shift) => sum + parseFloat(shift.totalTimeOnline), 0)
    .toFixed(1);
  const avgBreaks = (
    filteredShifts.reduce((sum, shift) => sum + shift.breaks, 0) /
      filteredShifts.length || 0
  ).toFixed(1);

  // Max jobs for progress bar scaling
  const maxJobs = Math.max(...filteredShifts.map((shift) => shift.jobsDone), 1);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <ClockIcon
                className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Shifts
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Manage and monitor shift details
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={exportToExcel}
                className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out w-28 sm:w-40"
                aria-label="Export to Excel"
              >
                Export to Excel
              </button>
              <button
                onClick={exportToPDF}
                className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out w-28 sm:w-40"
                aria-label="Export to PDF"
              >
                Export to PDF
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search by driver name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            aria-label="Search drivers"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Break">On Break</option>
          </select>
          <input
            type="date"
            value={dateFilter ? dateFilter.toISOString().slice(0, 10) : ""}
            onChange={(e) =>
              setDateFilter(e.target.value ? new Date(e.target.value) : null)
            }
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            aria-label="Filter by date"
          />
          <select
            value={topFilter}
            onChange={(e) => setTopFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            aria-label="Filter by top performers"
          >
            <option value="all">All Drivers</option>
            <option value="5">Top 5</option>
            <option value="10">Top 10</option>
            <option value="20">Top 20</option>
          </select>
          <label className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="checkbox"
              checked={showUnderperformers}
              onChange={(e) => setShowUnderperformers(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              aria-label="Show underperforming drivers"
            />
            <span className="text-sm text-gray-700">Show Underperformers</span>
          </label>
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out w-28 sm:w-36"
            aria-label="Clear all filters"
          >
            Clear
          </button>
        </div>

        {/* Summary Dashboard */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-label="Loading"
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
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3 sm:gap-6 lg:grid-cols-3">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <BriefcaseIcon
                  className="h-6 w-6 text-[#2E7D32] flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Total Jobs Done
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-[#2E7D32]">
                    {totalJobs}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <UserGroupIcon
                  className="h-6 w-6 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Active Drivers
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-blue-600">
                    {activeDrivers}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <UserIcon
                  className="h-6 w-6 text-[#2E7D32] flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Avg. Jobs/Active
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-[#2E7D32]">
                    {avgJobsPerActiveDriver}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <ClockIcon
                  className="h-6 w-6 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Total Online Hours
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-blue-600">
                    {totalOnlineHours} h
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <PauseIcon
                  className="h-6 w-6 text-[#2E7D32] flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Avg. Breaks (min)
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-[#2E7D32]">
                    {avgBreaks}
                  </p>
                </div>
              </div>
            </div>

            {/* Drivers Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Drivers
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "Driver Name",
                        "Vehicle Allocated",
                        "Jobs Done",
                        "Status",
                        "Breaks (min)",
                        "Time Started",
                        "Time Ended",
                        "Total Time Online",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
                          onClick={() => handleSort(headerToKey[header])}
                        >
                          {header}
                          {sortConfig.key === headerToKey[header] && (
                            <span className="ml-1 sm:ml-2">
                              {sortConfig.direction === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredShifts
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((shift) => (
                        <tr
                          key={shift.id}
                          className="hover:bg-gray-50 transition duration-300 ease-in-out"
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 flex items-center space-x-2">
                            <UserIcon
                              className={`h-5 w-5 ${
                                shift.status === "Active"
                                  ? "text-green-600"
                                  : shift.status === "Inactive"
                                  ? "text-red-600"
                                  : "text-orange-600"
                              }`}
                              aria-hidden="true"
                            />
                            <span>{shift.driverName}</span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {shift.vehicleAllocated}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            <div className="flex items-center space-x-2">
                              <BriefcaseIcon
                                className="h-4 w-4 text-gray-500"
                                aria-hidden="true"
                              />
                              <span>{shift.jobsDone}</span>
                              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-indigo-600 h-1.5 rounded-full"
                                  style={{
                                    width: `${
                                      (shift.jobsDone / maxJobs) * 100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-normal rounded-full ${
                                shift.status === "Active"
                                  ? "bg-green-100 text-green-700"
                                  : shift.status === "Inactive"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {shift.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {shift.breaks}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {new Date(shift.timeStarted).toLocaleString()}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {new Date(shift.timeEnded).toLocaleString()}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {shift.totalTimeOnline}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {page * rowsPerPage + 1} to{" "}
                {Math.min((page + 1) * rowsPerPage, filteredShifts.length)} of{" "}
                {filteredShifts.length} shifts
              </div>
              <div className="flex gap-1 flex-wrap justify-center">
                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleChangePage(p)}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg transition duration-300 ease-in-out ${
                      page === p
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                    }`}
                    aria-label={`Go to page ${p + 1}`}
                  >
                    {p + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Shifts;
