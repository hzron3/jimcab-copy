"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  TruckIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  AddVehicleModal,
  EditVehicleModal,
  DeleteVehicleModal,
} from "@/app/components/VehicleActionsModals";

// Mock vehicle data
const mockVehicles = [
  {
    id: 1,
    registration: "KDA001B",
    fleetNumber: "JIM001B",
    attribution: "TECNO",
    model: "Fielder",
    make: "Toyota",
    capacity: 4,
    activationCode: "0a1a3",
    status: "ACTIVE",
    dateAdded: "2025-05-30T09:29:00",
  },
  {
    id: 2,
    registration: "KCM069V",
    fleetNumber: "JIM123",
    attribution: "Xiaomi",
    model: "Fielder",
    make: "Toyota",
    capacity: 4,
    activationCode: "ee14a",
    status: "ACTIVE",
    dateAdded: "2025-05-29T16:59:00",
  },
  {
    id: 3,
    registration: "KAS445V",
    fleetNumber: "JIM007",
    attribution: "Google",
    model: "C200",
    make: "Mercedes",
    capacity: 4,
    activationCode: "84a55",
    status: "ACTIVE",
    dateAdded: "2025-05-21T13:25:00",
  },
  {
    id: 4,
    registration: "KBH145Q",
    fleetNumber: "NH004",
    attribution: "Samsung",
    model: "Voxy Z",
    make: "Pajero",
    capacity: 14,
    activationCode: "dfa33",
    status: "ACTIVE",
    dateAdded: "2025-05-20T14:54:00",
  },
  {
    id: 5,
    registration: "KBT005T",
    fleetNumber: "3456",
    attribution: "TECNO",
    model: "Mark X",
    make: "Toyota",
    capacity: 4,
    activationCode: "ed4c7",
    status: "ACTIVE",
    dateAdded: "2025-05-07T13:24:00",
  },
];

// Mock API function
const fetchVehicles = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockVehicles;
};

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [makeFilter, setMakeFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    registration: "",
    fleetNumber: "",
    attribution: "",
    model: "",
    make: "",
    capacity: "",
    activationCode: "",
    status: "ACTIVE",
  });
  const [editVehicle, setEditVehicle] = useState(null);
  const [deleteVehicle, setDeleteVehicle] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const rowsPerPage = 10;

  // Fetch vehicles on mount
  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await fetchVehicles();
        setVehicles(data);
        setFilteredVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    loadVehicles();
  }, []);

  // Handle filters
  useEffect(() => {
    let filtered = [...vehicles];

    if (search) {
      filtered = filtered.filter((vehicle) =>
        vehicle.registration.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.status === statusFilter);
    }

    if (makeFilter !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.make === makeFilter);
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

    setFilteredVehicles(filtered);
    setPage(0);
  }, [search, statusFilter, makeFilter, sortConfig, vehicles]);

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setMakeFilter("all");
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredVehicles.map((vehicle) => ({
          ID: vehicle.id,
          "Vehicle Registration": vehicle.registration,
          "Fleet Number": vehicle.fleetNumber,
          Attribution: vehicle.attribution,
          "Vehicle Model": vehicle.model,
          "Vehicle Make": vehicle.make,
          Capacity: vehicle.capacity,
          "Activation Code": vehicle.activationCode,
          Status: vehicle.status,
          "Date Added": vehicle.dateAdded
            ? new Date(vehicle.dateAdded).toLocaleString()
            : "N/A",
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");
      XLSX.writeFile(workbook, "vehicles_export.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel.");
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Vehicles Report", 14, 20);
      doc.autoTable({
        startY: 30,
        head: [
          [
            "#",
            "Vehicle Registration",
            "Fleet Number",
            "Attribution",
            "Vehicle Model",
            "Vehicle Make",
            "Capacity",
            "Activation Code",
            "Status",
            "Date Added",
          ],
        ],
        body: filteredVehicles.map((vehicle) => [
          vehicle.id,
          vehicle.registration,
          vehicle.fleetNumber,
          vehicle.attribution,
          vehicle.model,
          vehicle.make,
          vehicle.capacity,
          vehicle.activationCode,
          vehicle.status,
          vehicle.dateAdded
            ? new Date(vehicle.dateAdded).toLocaleString()
            : "N/A",
        ]),
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229] },
        styles: { cellPadding: 3, fontSize: 10 },
      });
      doc.save("vehicles_export.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF.");
    }
  };

  // Validate form
  const validateForm = (vehicle) => {
    const errors = {};
    if (!vehicle.registration.trim())
      errors.registration = "Vehicle Registration is required";
    if (!vehicle.fleetNumber.trim())
      errors.fleetNumber = "Fleet Number is required";
    if (!vehicle.make.trim()) errors.make = "Vehicle Make is required";
    if (!vehicle.model.trim()) errors.model = "Vehicle Model is required";
    if (
      !vehicle.capacity ||
      isNaN(parseInt(vehicle.capacity)) ||
      parseInt(vehicle.capacity) <= 0
    )
      errors.capacity = "Valid Capacity is required";
    if (!vehicle.activationCode.trim())
      errors.activationCode = "Activation Code is required";
    return errors;
  };

  // Handle add vehicle
  const handleAddVehicle = () => {
    const errors = validateForm(newVehicle);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = Math.max(...vehicles.map((v) => v.id), 0) + 1;
    const newVehicleData = {
      id: newId,
      ...newVehicle,
      capacity: parseInt(newVehicle.capacity),
      dateAdded: new Date().toISOString(),
    };
    setVehicles([...vehicles, newVehicleData]);
    setFilteredVehicles([...filteredVehicles, newVehicleData]);
    setNewVehicle({
      registration: "",
      fleetNumber: "",
      attribution: "",
      model: "",
      make: "",
      capacity: "",
      activationCode: "",
      status: "ACTIVE",
    });
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  // Handle edit vehicle
  const handleEditVehicle = () => {
    const errors = validateForm(editVehicle);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updatedVehicles = vehicles.map((v) =>
      v.id === editVehicle.id
        ? {
            ...editVehicle,
            capacity: parseInt(editVehicle.capacity),
            dateAdded: v.dateAdded,
          }
        : v
    );
    setVehicles(updatedVehicles);
    setFilteredVehicles(updatedVehicles);
    setEditVehicle(null);
    setFormErrors({});
    setIsEditModalOpen(false);
  };

  // Handle delete vehicle
  const handleDeleteVehicle = () => {
    const updatedVehicles = vehicles.filter((v) => v.id !== deleteVehicle.id);
    setVehicles(updatedVehicles);
    setFilteredVehicles(updatedVehicles);
    setDeleteVehicle(null);
    setIsDeleteModalOpen(false);
  };

  // Summary statistics
  const totalVehicles = filteredVehicles.length;
  const activeVehicles = filteredVehicles.filter(
    (vehicle) => vehicle.status === "ACTIVE"
  ).length;
  const inactiveVehicles = filteredVehicles.filter(
    (vehicle) => vehicle.status === "INACTIVE"
  ).length;
  const uniqueMakes = new Set(filteredVehicles.map((vehicle) => vehicle.make))
    .size;

  // Calculate page numbers
  const pageCount = Math.ceil(filteredVehicles.length / rowsPerPage);
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  // Unique makes for filter
  const uniqueMakesList = [
    ...new Set(vehicles.map((vehicle) => vehicle.make)),
  ].sort();

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 w-full">
      <div className="w-full  mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <TruckIcon
                className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Vehicles
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Manage and monitor vehicle details
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
                aria-label="Add new vehicle"
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
            placeholder="Search by vehicle registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Search vehicles"
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
            value={makeFilter}
            onChange={(e) => setMakeFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Filter by make"
          >
            <option value="all">All Makes</option>
            {uniqueMakesList.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
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
                <TruckIcon
                  className="h-6 w-6 text-indigo-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Total Vehicles
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-indigo-600">
                    {totalVehicles}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 ease-in-out">
                <TruckIcon
                  className="h-6 w-6 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Active Vehicles
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-blue-600">
                    {activeVehicles}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 ease-in-out">
                <ExclamationTriangleIcon
                  className="h-6 w-6 text-purple-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Inactive Vehicles
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-purple-600">
                    {inactiveVehicles}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 ease-in-out">
                <UsersIcon
                  className="h-6 w-6 text-teal-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Unique Makes
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-teal-600">
                    {uniqueMakes}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicles Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Vehicles
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      {[
                        "#",
                        "Vehicle Registration",
                        "Fleet Number",
                        "Attribution",
                        "Vehicle Model",
                        "Vehicle Make",
                        "Capacity",
                        "Activation Code",
                        "Status",
                        "Date Added",
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
                    {filteredVehicles
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((vehicle, index) => (
                        <tr
                          key={vehicle.id}
                          className={`transition duration-300 ease-in-out ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-indigo-50`}
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {vehicle.id}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 flex items-center space-x-2 min-w-[150px]">
                            <TruckIcon
                              className="h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                            <span>{vehicle.registration}</span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {vehicle.fleetNumber}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {vehicle.attribution}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {vehicle.model}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {vehicle.make}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {vehicle.capacity}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {vehicle.activationCode}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-normal rounded-full ${
                                vehicle.status === "ACTIVE"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {vehicle.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 min-w-[150px]">
                            {vehicle.dateAdded
                              ? new Date(vehicle.dateAdded).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditVehicle({
                                    ...vehicle,
                                    capacity: vehicle.capacity.toString(),
                                  });
                                  setIsEditModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800"
                                aria-label={`Edit vehicle ${vehicle.registration}`}
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
                                  setDeleteVehicle(vehicle);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                                aria-label={`Delete vehicle ${vehicle.registration}`}
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
                        Showing {filteredVehicles.length} vehicles
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
                {Math.min((page + 1) * rowsPerPage, filteredVehicles.length)} of{" "}
                {filteredVehicles.length} vehicles
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
        <AddVehicleModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormErrors({});
            setNewVehicle({
              registration: "",
              fleetNumber: "",
              attribution: "",
              model: "",
              make: "",
              capacity: "",
              activationCode: "",
              status: "ACTIVE",
            });
          }}
          newVehicle={newVehicle}
          setNewVehicle={setNewVehicle}
          onSave={handleAddVehicle}
          formErrors={formErrors}
        />
        <EditVehicleModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditVehicle(null);
            setFormErrors({});
          }}
          editVehicle={editVehicle}
          setEditVehicle={setEditVehicle}
          onSave={handleEditVehicle}
          formErrors={formErrors}
        />
        <DeleteVehicleModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteVehicle(null);
          }}
          vehicle={deleteVehicle}
          onDelete={handleDeleteVehicle}
        />
      </div>
    </div>
  );
};

// Map header to sort key
const headerToKey = {
  "#": "id",
  "Vehicle Registration": "registration",
  "Fleet Number": "fleetNumber",
  Attribution: "attribution",
  "Vehicle Model": "model",
  "Vehicle Make": "make",
  Capacity: "capacity",
  "Activation Code": "activationCode",
  Status: "status",
  "Date Added": "dateAdded",
};

export default VehiclesPage;
