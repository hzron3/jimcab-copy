"use client";

import React, { useState, useEffect } from "react";
import { UsersIcon } from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Mock data (unchanged)
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-06-15",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2025-06-14",
    createdAt: "2024-02-15",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2025-06-10",
    createdAt: "2024-03-20",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-06-13",
    createdAt: "2024-04-05",
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2025-06-12",
    createdAt: "2024-05-10",
  },
  {
    id: 6,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2025-06-08",
    createdAt: "2024-06-15",
  },
  {
    id: 7,
    name: "David Lee",
    email: "david@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-06-11",
    createdAt: "2024-07-20",
  },
  {
    id: 8,
    name: "Sarah Clark",
    email: "sarah@example.com",
    role: "User",
    status: "Active",
    lastLogin: "2025-06-09",
    createdAt: "2024-08-25",
  },
  {
    id: 9,
    name: "Michael Adams",
    email: "michael@example.com",
    role: "User",
    status: "Inactive",
    lastLogin: "2025-06-07",
    createdAt: "2024-09-30",
  },
  {
    id: 10,
    name: "Laura Taylor",
    email: "laura@example.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-06-06",
    createdAt: "2024-10-05",
  },
];

// Mock API function (unchanged)
const fetchUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockUsers;
};

const AppUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetch users on mount (unchanged)
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Handle search and filters (unchanged)
  useEffect(() => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.direction === "asc") {
          return aValue.localeCompare(bValue);
        }
        return bValue.localeCompare(aValue);
      });
    }

    setFilteredUsers(filtered);
    setPage(0);
  }, [search, roleFilter, statusFilter, sortConfig, users]);

  // Export to Excel (unchanged)
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users_export.xlsx");
  };

  // Export to PDF (unchanged)
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Users Report", 14, 20);

    doc.autoTable({
      startY: 30,
      head: [
        ["ID", "Name", "Email", "Role", "Status", "Last Login", "Created At"],
      ],
      body: filteredUsers.map((user) => [
        user.id,
        user.name,
        user.email,
        user.role,
        user.status,
        user.lastLogin,
        user.createdAt,
      ]),
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { cellPadding: 3, fontSize: 10 },
    });

    doc.save("users_export.pdf");
  };

  // Handle pagination (unchanged)
  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  // Handle sort (unchanged)
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Calculate page numbers (unchanged)
  const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto">
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
                  App Users
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Manage and monitor user details
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
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
          />
          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "ID",
                    "Name",
                    "Email",
                    "Role",
                    "Status",
                    "Last Login",
                    "Created At",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 sm:px-6 sm:py-3.5 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                      onClick={() =>
                        handleSort(header.toLowerCase().replace(" ", ""))
                      }
                    >
                      {header}
                      {sortConfig.key ===
                        header.toLowerCase().replace(" ", "") && (
                        <span className="ml-1 sm:ml-2">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                        {user.id}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                        {user.name}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                        {user.email}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                        {user.role}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-medium rounded-full ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                        {user.lastLogin}
                      </td>
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                        {user.createdAt}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing {page * rowsPerPage + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} users
          </div>
          <div className="flex gap-1 flex-wrap justify-center">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => handleChangePage(p)}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-lg transition duration-150 ${
                  page === p
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {p + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppUsers;
