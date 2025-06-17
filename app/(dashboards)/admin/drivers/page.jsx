"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  UserIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  AddDriverModal,
  EditDriverModal,
  DeleteDriverModal,
} from "@/app/components/DriversActionsModal";

// Mock driver data
const mockDrivers = [
  {
    id: 1,
    driverName: "Driver Newton",
    driverNumber: "DR001007",
    badgeNumber: "000111222",
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "2025-06-19T03:00:00",
    insuranceExpires: null,
    dateCreated: "2025-06-12T11:23:00",
  },
  {
    id: 2,
    driverName: "George Bush",
    driverNumber: "DRV023",
    badgeNumber: null,
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "2025-12-31T03:00:00",
    insuranceExpires: "2025-12-31T03:00:00",
    dateCreated: "2025-05-30T10:41:00",
  },
  {
    id: 3,
    driverName: "James Wahomey",
    driverNumber: "DRV017",
    badgeNumber: "BDG017",
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "2025-12-31T03:00:00",
    insuranceExpires: "2025-12-31T03:00:00",
    dateCreated: "2025-05-30T09:32:00",
  },
  {
    id: 4,
    driverName: "Jack Sboy",
    driverNumber: "DRV123",
    badgeNumber: null,
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "2025-06-01T03:00:00",
    insuranceExpires: "2025-12-31T03:00:00",
    dateCreated: "2025-05-29T16:55:00",
  },
  {
    id: 5,
    driverName: "Newton Driver",
    driverNumber: "DR00045",
    badgeNumber: null,
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "2025-07-22T03:00:00",
    insuranceExpires: "2025-07-02T03:00:00",
    dateCreated: "2025-05-25T08:31:00",
  },
  {
    id: 6,
    driverName: "Chris",
    driverNumber: "DRV0007",
    badgeNumber: "BDG007",
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "2025-05-22T03:00:00",
    insuranceExpires: "2025-06-01T03:00:00",
    dateCreated: "2025-05-21T13:30:00",
  },
  {
    id: 7,
    driverName: "Driver James",
    driverNumber: "dr003",
    badgeNumber: null,
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "2025-10-01T03:00:00",
    insuranceExpires: "2025-08-21T03:00:00",
    dateCreated: "2025-05-20T14:45:00",
  },
  {
    id: 8,
    driverName: "Dennis Mwebia",
    driverNumber: "DR0001",
    badgeNumber: "2839",
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "2025-01-12T03:00:00",
    insuranceExpires: "2025-01-21T03:00:00",
    dateCreated: "2025-05-07T13:23:00",
  },
];

// Mock API function
const fetchDrivers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockDrivers;
};

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [licenseFilter, setLicenseFilter] = useState("all");
  const [insuranceFilter, setInsuranceFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newDriver, setNewDriver] = useState({
    driverName: "",
    driverNumber: "",
    badgeNumber: "",
    status: "ACTIVE",
    currentVehicle: "None",
    activeShift: "undefined (Started: N/A)",
    licenseExpires: "",
    insuranceExpires: "",
    dateCreated: "",
  });
  const [editDriver, setEditDriver] = useState(null);
  const [deleteDriver, setDeleteDriver] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const rowsPerPage = 10;

  // Fetch drivers on mount
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await fetchDrivers();
        setDrivers(data);
        setFilteredDrivers(data);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDrivers();
  }, []);

  // Handle filters
  useEffect(() => {
    let filtered = [...drivers];

    if (search) {
      filtered = filtered.filter((driver) =>
        driver.driverName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((driver) => driver.status === statusFilter);
    }

    if (licenseFilter === "expiring") {
      const today = new Date();
      const thirtyDaysFromNow = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000
      );
      filtered = filtered.filter(
        (driver) =>
          driver.licenseExpires &&
          new Date(driver.licenseExpires) <= thirtyDaysFromNow
      );
    }

    if (insuranceFilter === "expiring") {
      const today = new Date();
      const thirtyDaysFromNow = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000
      );
      filtered = filtered.filter(
        (driver) =>
          driver.insuranceExpires &&
          new Date(driver.insuranceExpires) <= thirtyDaysFromNow
      );
    }

    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";
        if (sortConfig.direction === "asc") {
          return aValue.toString().localeCompare(bValue.toString());
        }
        return bValue.toString().localeCompare(aValue.toString());
      });
    }

    setFilteredDrivers(filtered);
    setPage(0);
  }, [
    search,
    statusFilter,
    licenseFilter,
    insuranceFilter,
    sortConfig,
    drivers,
  ]);

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setLicenseFilter("all");
    setInsuranceFilter("all");
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredDrivers.map((driver) => ({
        ID: driver.id,
        "Driver Name": driver.driverName,
        "Driver Number": driver.driverNumber,
        "Badge Number": driver.badgeNumber || "N/A",
        Status: driver.status,
        "Current Vehicle": driver.currentVehicle,
        "Active Shift": driver.activeShift,
        "License Expires": driver.licenseExpires
          ? new Date(driver.licenseExpires).toLocaleString()
          : "N/A",
        "Insurance Expires": driver.insuranceExpires
          ? new Date(driver.insuranceExpires).toLocaleString()
          : "N/A",
        "Date Created": driver.dateCreated
          ? new Date(driver.dateCreated).toLocaleString()
          : "N/A",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
    XLSX.writeFile(workbook, "drivers_export.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Drivers Report", 14, 20);

    doc.autoTable({
      startY: 30,
      head: [
        [
          "#",
          "Driver Name",
          "Driver Number",
          "Badge Number",
          "Status",
          "Current Vehicle",
          "Active Shift",
          "License Expires",
          "Insurance Expires",
          "Date Created",
        ],
      ],
      body: filteredDrivers.map((driver) => [
        driver.id,
        driver.driverName,
        driver.driverNumber,
        driver.badgeNumber || "N/A",
        driver.status,
        driver.currentVehicle,
        driver.activeShift,
        driver.licenseExpires
          ? new Date(driver.licenseExpires).toLocaleString()
          : "N/A",
        driver.insuranceExpires
          ? new Date(driver.insuranceExpires).toLocaleString()
          : "N/A",
        driver.dateCreated
          ? new Date(driver.dateCreated).toLocaleString()
          : "N/A",
      ]),
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { cellPadding: 3, fontSize: 10 },
    });

    doc.save("drivers_export.pdf");
  };

  // Validate form
  const validateForm = (driver) => {
    const errors = {};
    if (!driver.driverName.trim())
      errors.driverName = "Driver Name is required";
    if (!driver.driverNumber.trim())
      errors.driverNumber = "Driver Number is required";
    if (!driver.licenseExpires)
      errors.licenseExpires = "License Expiry Date is required";
    return errors;
  };

  // Handle add driver
  const handleAddDriver = () => {
    const errors = validateForm(newDriver);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = Math.max(...drivers.map((d) => d.id), 0) + 1;
    const newDriverData = {
      id: newId,
      ...newDriver,
      dateCreated: new Date().toISOString(),
    };
    setDrivers([...drivers, newDriverData]);
    setFilteredDrivers([...filteredDrivers, newDriverData]);
    setNewDriver({
      driverName: "",
      driverNumber: "",
      badgeNumber: "",
      status: "ACTIVE",
      currentVehicle: "None",
      activeShift: "undefined (Started: N/A)",
      licenseExpires: "",
      insuranceExpires: "",
      dateCreated: "",
    });
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  // Handle edit driver
  const handleEditDriver = () => {
    const errors = validateForm(editDriver);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updatedDrivers = drivers.map((d) =>
      d.id === editDriver.id ? { ...editDriver, dateCreated: d.dateCreated } : d
    );
    setDrivers(updatedDrivers);
    setFilteredDrivers(updatedDrivers);
    setEditDriver(null);
    setFormErrors({});
    setIsEditModalOpen(false);
  };

  // Handle delete driver
  const handleDeleteDriver = () => {
    const updatedDrivers = drivers.filter((d) => d.id !== deleteDriver.id);
    setDrivers(updatedDrivers);
    setFilteredDrivers(updatedDrivers);
    setDeleteDriver(null);
    setIsDeleteModalOpen(false);
  };

  // Summary statistics
  const totalDrivers = filteredDrivers.length;
  const activeDrivers = filteredDrivers.filter(
    (driver) => driver.status === "ACTIVE"
  ).length;
  const expiringLicenses = filteredDrivers.filter((driver) => {
    if (!driver.licenseExpires) return false;
    const expiryDate = new Date(driver.licenseExpires);
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    return expiryDate <= thirtyDaysFromNow;
  }).length;
  const expiringInsurance = filteredDrivers.filter((driver) => {
    if (!driver.insuranceExpires) return false;
    const expiryDate = new Date(driver.insuranceExpires);
    const today = new Date();
    const thirtyDaysFromNow = new Date(
      today.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    return expiryDate <= thirtyDaysFromNow;
  }).length;

  // Average license expiration days (only for non-expired licenses)
  const avgLicenseDays =
    filteredDrivers.reduce((sum, driver) => {
      if (driver.licenseExpires) {
        const days =
          (new Date(driver.licenseExpires) - new Date()) /
          (1000 * 60 * 60 * 24);
        return sum + (days > 0 ? days : 0);
      }
      return sum;
    }, 0) / (filteredDrivers.filter((d) => d.licenseExpires).length || 1);

  // Calculate page numbers
  const pageCount = Math.ceil(filteredDrivers.length / rowsPerPage);
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  // Check if license or insurance is expired
  const isExpired = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <UsersIcon
                className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Drivers
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Manage and monitor driver details
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
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out w-28 sm:w-40"
                aria-label="Add new driver"
              >
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 flex-wrap bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <input
            type="text"
            placeholder="Search by driver name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Search drivers"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <select
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Filter by license status"
          >
            <option value="all">All Licenses</option>
            <option value="expiring">Expiring or Expired</option>
          </select>
          <select
            value={insuranceFilter}
            onChange={(e) => setInsuranceFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Filter by insurance status"
          >
            <option value="all">All Insurance</option>
            <option value="expiring">Expiring or Expired</option>
          </select>
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out w-28 sm:w-40"
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
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4 sm:gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 ease-in-out">
                <UsersIcon
                  className="h-6 w-6 text-indigo-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Total Drivers
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-indigo-600">
                    {totalDrivers}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 ease-in-out">
                <UserIcon
                  className="h-6 w-6 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Active Drivers
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-blue-600">
                    {activeDrivers}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 ease-in-out">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-indigo-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Expiring/Expired Licenses
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-indigo-600">
                    {expiringLicenses}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 ease-in-out">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Expiring/Expired Insurance
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-blue-600">
                    {expiringInsurance}
                  </p>
                </div>
              </div>
            </div>
            {/* Drivers Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Drivers
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      {[
                        "#",
                        "Driver Name",
                        "Driver Number",
                        "Badge Number",
                        "Status",
                        "Current Vehicle",
                        "Active Shift",
                        "License Expires",
                        "Insurance Expires",
                        "Date Created",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out min-w-[100px]"
                          onClick={
                            header !== "Actions"
                              ? () => {
                                  setSortConfig((prev) => ({
                                    key: headerToKey[header],
                                    direction:
                                      prev.key === headerToKey[header] &&
                                      prev.direction === "asc"
                                        ? "desc"
                                        : "asc",
                                  }));
                                }
                              : undefined
                          }
                        >
                          {header}
                          {sortConfig.key === headerToKey[header] &&
                            header !== "Actions" && (
                              <span className="ml-1 sm:ml-2">
                                {sortConfig.direction === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDrivers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((driver, index) => (
                        <tr
                          key={driver.id}
                          className={`transition duration-300 ease-in-out ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-indigo-50`}
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {driver.id}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 flex items-center space-x-2 min-w-[150px]">
                            <UserIcon
                              className="h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                            <span>{driver.driverName}</span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 min-w-[120px]">
                            {driver.driverNumber}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-600">
                            {driver.badgeNumber || "N/A"}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-normal rounded-full ${
                                driver.status === "ACTIVE"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {driver.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {driver.currentVehicle}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 min-w-[150px]">
                            {driver.activeShift}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base min-w-[150px]">
                            <span
                              className={`${
                                isExpired(driver.licenseExpires)
                                  ? "text-red-600 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {driver.licenseExpires
                                ? new Date(
                                    driver.licenseExpires
                                  ).toLocaleString()
                                : "N/A"}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base min-w-[150px]">
                            <span
                              className={`${
                                isExpired(driver.insuranceExpires)
                                  ? "text-red-600 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              {driver.insuranceExpires
                                ? new Date(
                                    driver.insuranceExpires
                                  ).toLocaleString()
                                : "N/A"}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base min-w-[150px]">
                            {driver.dateCreated
                              ? new Date(driver.dateCreated).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditDriver({
                                    ...driver,
                                    licenseExpires: driver.licenseExpires
                                      ? new Date(driver.licenseExpires)
                                          .toISOString()
                                          .slice(0, 10)
                                      : "",
                                    insuranceExpires: driver.insuranceExpires
                                      ? new Date(driver.insuranceExpires)
                                          .toISOString()
                                          .slice(0, 10)
                                      : "",
                                  });
                                  setIsEditModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800"
                                aria-label={`Edit driver ${driver.driverName}`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="currentColor"
                                  className="size-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteDriver(driver);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                                aria-label={`Delete driver ${driver.driverName}`}
                              >
                                <TrashIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td
                        colSpan="11"
                        className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-gray-600 text-right"
                      >
                        Showing {filteredDrivers.length} drivers | Avg. License
                        Expiry (non-expired): {avgLicenseDays.toFixed(1)} days
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
              <div className="text-sm sm:text-base text-gray-600">
                Showing {page * rowsPerPage + 1} to{" "}
                {Math.min((page + 1) * rowsPerPage, filteredDrivers.length)} of{" "}
                {filteredDrivers.length} drivers
              </div>
              <div className="flex gap-1 flex-wrap justify-center">
                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base rounded-lg transition duration-300 ease-in-out ${
                      page === p
                        ? "bg-indigo-600 text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-indigo-50"
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

        {/* Modals */}
        <AddDriverModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormErrors({});
            setNewDriver({
              driverName: "",
              driverNumber: "",
              badgeNumber: "",
              status: "ACTIVE",
              currentVehicle: "None",
              activeShift: "undefined (Started: N/A)",
              licenseExpires: "",
              insuranceExpires: "",
              dateCreated: "",
            });
          }}
          onSave={handleAddDriver}
          newDriver={newDriver}
          setNewDriver={setNewDriver}
          formErrors={formErrors}
        />
        <EditDriverModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditDriver(null);
            setFormErrors({});
          }}
          onSave={handleEditDriver}
          editDriver={editDriver}
          setEditDriver={setEditDriver}
          formErrors={formErrors}
        />
        <DeleteDriverModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteDriver(null);
          }}
          onDelete={handleDeleteDriver}
          driver={deleteDriver}
        />
      </div>
    </div>
  );
};

// Map header to sort key
const headerToKey = {
  "#": "id",
  "Driver Name": "driverName",
  "Driver Number": "driverNumber",
  "Badge Number": "badgeNumber",
  Status: "status",
  "Current Vehicle": "currentVehicle",
  "Active Shift": "activeShift",
  "License Expires": "licenseExpires",
  "Insurance Expires": "insuranceExpires",
  "Date Created": "dateCreated",
};

export default DriversPage;
