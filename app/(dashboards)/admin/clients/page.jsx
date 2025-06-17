"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  UserIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import AddClientModal from "@/app/components/AddClientModal";
import EditClientModal from "@/app/components/EditClientModal";
import DeleteClientModal from "@/app/components/DeleteClientModal";

// Mock client data
const mockClients = [
  {
    id: 1,
    name: "Acme Corp",
    staff: 50,
    status: "Active",
    dateCreated: "2025-01-10T00:00:00",
    department: "Corporate",
  },
  {
    id: 2,
    name: "Beta Ltd",
    staff: 30,
    status: "Inactive",
    dateCreated: "2025-02-15T00:00:00",
    department: "Travel Agency",
  },
  {
    id: 3,
    name: "Gamma Group",
    staff: 75,
    status: "Active",
    dateCreated: "2025-03-20T00:00:00",
    department: "Corporate",
  },
  {
    id: 4,
    name: "Delta PLC",
    staff: 20,
    status: "Active",
    dateCreated: "2025-04-05T00:00:00",
    department: "Travel Agency",
  },
  {
    id: 5,
    name: "Epsilon Inc",
    staff: 40,
    status: "Inactive",
    dateCreated: "2025-05-10T00:00:00",
    department: "Corporate",
  },
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 6,
    name: `Client ${i + 6}`,
    staff: Math.floor(Math.random() * 100) + 10,
    status: Math.random() > 0.5 ? "Active" : "Inactive",
    dateCreated: `2025-06-${String(i + 1).padStart(2, "0")}T00:00:00`,
    department: Math.random() > 0.5 ? "Corporate" : "Travel Agency",
  })),
];

// Mock API function
const fetchClients = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockClients;
};

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    staff: "",
    status: "Active",
    department: "Corporate",
  });
  const [editClient, setEditClient] = useState(null);
  const [deleteClient, setDeleteClient] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const rowsPerPage = 10;

  // Fetch clients on mount
  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      } finally {
        setLoading(false);
      }
    };
    loadClients();
  }, []);

  // Handle filters
  useEffect(() => {
    let filtered = [...clients];

    if (search) {
      filtered = filtered.filter((client) =>
        client.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((client) => client.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (client) => client.department === departmentFilter
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

    setFilteredClients(filtered);
    setPage(0);
  }, [search, statusFilter, departmentFilter, sortConfig, clients]);

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  // Export to Excel
  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        filteredClients.map((client) => ({
          ID: client.id,
          Name: client.name,
          Staff: client.staff,
          Status: client.status,
          "Date Created": client.dateCreated
            ? new Date(client.dateCreated).toLocaleString()
            : "N/A",
          Department: client.department,
        }))
      );
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
      XLSX.writeFile(workbook, "clients_export.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      alert("Failed to export to Excel.");
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Clients Report", 14, 20);
      doc.autoTable({
        startY: 30,
        head: [["#", "Name", "Staff", "Status", "Date Created", "Department"]],
        body: filteredClients.map((client) => [
          client.id,
          client.name,
          client.staff,
          client.status,
          client.dateCreated
            ? new Date(client.dateCreated).toLocaleString()
            : "N/A",
          client.department,
        ]),
        theme: "striped",
        headStyles: { fillColor: [79, 70, 229] },
        styles: { cellPadding: 3, fontSize: 10 },
      });
      doc.save("clients_export.pdf");
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      alert("Failed to export to PDF.");
    }
  };

  // Validate form
  const validateForm = (client) => {
    const errors = {};
    if (!client.name.trim()) errors.name = "Client Name is required";
    if (
      !client.staff ||
      isNaN(parseInt(client.staff)) ||
      parseInt(client.staff) <= 0
    )
      errors.staff = "Valid Staff Count is required";
    return errors;
  };

  // Handle add client
  const handleAddClient = () => {
    const errors = validateForm(newClient);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = Math.max(...clients.map((c) => c.id), 0) + 1;
    const newClientData = {
      id: newId,
      ...newClient,
      staff: parseInt(newClient.staff),
      dateCreated: new Date().toISOString(),
    };
    setClients([...clients, newClientData]);
    setFilteredClients([...filteredClients, newClientData]);
    setNewClient({
      name: "",
      staff: "",
      status: "Active",
      department: "Corporate",
    });
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  // Handle edit client
  const handleEditClient = () => {
    const errors = validateForm(editClient);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updatedClients = clients.map((c) =>
      c.id === editClient.id
        ? {
            ...editClient,
            staff: parseInt(editClient.staff),
            dateCreated: c.dateCreated,
          }
        : c
    );
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setEditClient(null);
    setFormErrors({});
    setIsEditModalOpen(false);
  };

  // Handle delete client
  const handleDeleteClient = () => {
    const updatedClients = clients.filter((c) => c.id !== deleteClient.id);
    setClients(updatedClients);
    setFilteredClients(updatedClients);
    setDeleteClient(null);
    setIsDeleteModalOpen(false);
  };

  // Summary statistics
  const totalClients = filteredClients.length;
  const activeClients = filteredClients.filter(
    (client) => client.status === "Active"
  ).length;
  const inactiveClients = filteredClients.filter(
    (client) => client.status === "Inactive"
  ).length;
  const departmentCount = new Set(
    filteredClients.map((client) => client.department)
  ).size;

  // Calculate page numbers
  const pageCount = Math.ceil(filteredClients.length / rowsPerPage);
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 w-full">
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
                  Clients
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Manage and monitor client details
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
                aria-label="Add new client"
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
            placeholder="Search by client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Search clients"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
            aria-label="Filter by department"
          >
            <option value="all">All Departments</option>
            <option value="Corporate">Corporate</option>
            <option value="Travel Agency">Travel Agency</option>
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
                    Total Clients
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-indigo-600">
                    {totalClients}
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
                    Active Clients
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-blue-600">
                    {activeClients}
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
                    Inactive Clients
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-indigo-600">
                    {inactiveClients}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 ease-in-out">
                <UsersIcon
                  className="h-6 w-6 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-gray-600">
                    Departments
                  </h2>
                  <p className="text-xl sm:text-2xl font-semibold text-blue-600">
                    {departmentCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Clients Table */}
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Clients
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      {[
                        "#",
                        "Name",
                        "Staff",
                        "Status",
                        "Date Created",
                        "Department",
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
                    {filteredClients
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((client, index) => (
                        <tr
                          key={client.id}
                          className={`transition duration-300 ease-in-out ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          } hover:bg-indigo-50`}
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {client.id}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 flex items-center space-x-2 min-w-[150px]">
                            <UserIcon
                              className="h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                            <span>{client.name}</span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {client.staff}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs sm:text-sm font-normal rounded-full ${
                                client.status === "Active"
                                  ? "bg-indigo-100 text-indigo-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {client.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700 min-w-[150px]">
                            {client.dateCreated
                              ? new Date(client.dateCreated).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                            {client.department}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditClient({
                                    ...client,
                                    staff: client.staff.toString(),
                                  });
                                  setIsEditModalOpen(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-800"
                                aria-label={`Edit client ${client.name}`}
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
                                  setDeleteClient(client);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                                aria-label={`Delete client ${client.name}`}
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
                        colSpan="7"
                        className="px-3 py-2 sm:px-6 sm:py-3 text-sm sm:text-base text-gray-600 text-right"
                      >
                        Showing {filteredClients.length} clients
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
                {Math.min((page + 1) * rowsPerPage, filteredClients.length)} of{" "}
                {filteredClients.length} clients
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
        <AddClientModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormErrors({});
            setNewClient({
              name: "",
              staff: "",
              status: "Active",
              department: "Corporate",
            });
          }}
          newClient={newClient}
          setNewClient={setNewClient}
          onSave={handleAddClient}
          formErrors={formErrors}
        />
        <EditClientModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditClient(null);
            setFormErrors({});
          }}
          editClient={editClient}
          setEditClient={setEditClient}
          onSave={handleEditClient}
          formErrors={formErrors}
        />
        <DeleteClientModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteClient(null);
          }}
          client={deleteClient}
          onDelete={handleDeleteClient}
        />
      </div>
    </div>
  );
};

// Map header to sort key
const headerToKey = {
  "#": "id",
  Name: "name",
  Staff: "staff",
  Status: "status",
  "Date Created": "dateCreated",
  Department: "department",
};

export default ClientsPage;
