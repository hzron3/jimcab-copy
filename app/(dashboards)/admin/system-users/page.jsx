"use client";

import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  UserIcon,
  UsersIcon,
  BriefcaseIcon,
  ClipboardDocumentListIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  AddUserModal,
  EditUserModal,
  DeleteUserModal,
} from "@/app/components/SystemUsers";

// Mock user data
const mockUsers = [
  {
    id: 1,
    username: "developer_ujuzi",
    email: "developer.ujuzi@gmail.com",
    mobileNumber: "0701234567",
    role: "SUPERADMIN",
    status: "ACTIVE",
    lastActivity: "2025-06-17T08:05:00",
  },
  {
    id: 2,
    username: "Dispatch",
    email: "dispatch@email.com",
    mobileNumber: "0723576611",
    role: "DISPATCH",
    status: "ACTIVE",
    lastActivity: "2025-06-14T18:36:00",
  },
  {
    id: 3,
    username: "Accountant1",
    email: "accountant1@email.com",
    mobileNumber: "0734567890",
    role: "ACCOUNTS",
    status: "INACTIVE",
    lastActivity: "2025-06-10T12:15:00",
  },
  {
    id: 4,
    username: "Admin2",
    email: "admin2@email.com",
    mobileNumber: "0712345678",
    role: "SUPERADMIN",
    status: "ACTIVE",
    lastActivity: "2025-06-16T09:30:00",
  },
];

// Mock API function
const fetchUsers = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockUsers;
};

const SystemUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    role: "SUPERADMIN",
    status: "ACTIVE",
  });
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const rowsPerPage = 10;

  // Fetch users on mount
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

  // Handle filters
  useEffect(() => {
    let filtered = [...users];

    if (search) {
      filtered = filtered.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
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

    setFilteredUsers(filtered);
    setPage(0);
  }, [search, roleFilter, statusFilter, sortConfig, users]);

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SystemUsers");
    XLSX.writeFile(workbook, "system_users_export.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("System Users Report", 14, 20);

    doc.autoTable({
      startY: 30,
      head: [
        [
          "#",
          "Username",
          "Email",
          "Mobile Number",
          "Role",
          "Status",
          "Last Activity",
          "Actions",
        ],
      ],
      body: filteredUsers.map((user) => [
        user.id,
        user.username,
        user.email,
        user.mobileNumber,
        user.role,
        user.status,
        new Date(user.lastActivity).toLocaleString(),
        "",
      ]),
      theme: "striped",
      headStyles: { fillColor: [79, 70, 229] },
      styles: { cellPadding: 3, fontSize: 10 },
    });

    doc.save("system_users_export.pdf");
  };

  // Validate form
  const validateForm = (user) => {
    const errors = {};
    if (!user.username.trim()) errors.username = "Username is required";
    if (!user.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.email = "Invalid email format";
    }
    if (!user.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(user.mobileNumber)) {
      errors.mobileNumber = "Mobile number must be 10 digits";
    }
    return errors;
  };

  // Handle add user
  const handleAddUser = () => {
    const errors = validateForm(newUser);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = Math.max(...users.map((u) => u.id), 0) + 1;
    const newUserData = {
      id: newId,
      ...newUser,
      lastActivity: new Date().toISOString(),
    };
    setUsers([...users, newUserData]);
    setFilteredUsers([...filteredUsers, newUserData]);
    setNewUser({
      username: "",
      email: "",
      mobileNumber: "",
      role: "SUPERADMIN",
      status: "ACTIVE",
    });
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  // Handle edit user
  const handleEditUser = () => {
    const errors = validateForm(editUser);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updatedUsers = users.map((u) =>
      u.id === editUser.id
        ? { ...editUser, lastActivity: new Date().toISOString() }
        : u
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setEditUser(null);
    setFormErrors({});
    setIsEditModalOpen(false);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    const updatedUsers = users.filter((u) => u.id !== deleteUser.id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setDeleteUser(null);
    setIsDeleteModalOpen(false);
  };

  // Summary statistics
  const totalUsers = filteredUsers.length;
  const adminUsers = filteredUsers.filter(
    (user) => user.role === "SUPERADMIN"
  ).length;
  const dispatchUsers = filteredUsers.filter(
    (user) => user.role === "DISPATCH"
  ).length;
  const accountsUsers = filteredUsers.filter(
    (user) => user.role === "ACCOUNTS"
  ).length;

  // Calculate page numbers
  const pageCount = Math.ceil(filteredUsers.length / rowsPerPage);
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 w-full">
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
                  System Users
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Manage and monitor system user details
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
                aria-label="Add new user"
              >
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            aria-label="Search users"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            aria-label="Filter by role"
          >
            <option value="all">All Roles</option>
            <option value="SUPERADMIN">Admin</option>
            <option value="DISPATCH">Dispatch</option>
            <option value="ACCOUNTS">Accounts</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-32 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
            aria-label="Filter by status"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
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
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-4 sm:gap-6">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <UsersIcon
                  className="h-6 w-6 text-[#2E7D32] flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Total Users
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-[#2E7D32]">
                    {totalUsers}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <UserIcon
                  className="h-6 w-6 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Admin Users
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-blue-600">
                    {adminUsers}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <BriefcaseIcon
                  className="h-6 w-6 text-[#2E7D32] flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Dispatch Users
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-[#2E7D32]">
                    {dispatchUsers}
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-2xl shadow-lg flex items-center space-x-3 hover:bg-[#F5F5F5] transition-colors duration-300 ease-in-out">
                <ClipboardDocumentListIcon
                  className="h-6 w-6 text-blue-600 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-sm sm:text-base font-medium text-[#616161]">
                    Accounts Users
                  </h2>
                  <p className="text-xl sm:text-2xl font-medium text-blue-600">
                    {accountsUsers}
                  </p>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
              <div className="p-4 sm:p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  System Users
                </h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "#",
                        "Username",
                        "Email",
                        "Mobile Number",
                        "Role",
                        "Status",
                        "Last Activity",
                        "Actions",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out"
                          onClick={
                            header !== "Actions"
                              ? () => handleSort(headerToKey[header])
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
                    {filteredUsers
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 transition duration-300 ease-in-out"
                        >
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {user.id}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 flex items-center space-x-2">
                            <UserIcon
                              className="h-5 w-5 text-[#2E7D32]"
                              aria-hidden="true"
                            />
                            <span>{user.username}</span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {user.email}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {user.mobileNumber}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {user.role === "SUPERADMIN"
                              ? "Admin"
                              : user.role.charAt(0) +
                                user.role.slice(1).toLowerCase()}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-0.5 sm:px-2.5 sm:py-1 text-xs font-normal rounded-full ${
                                user.status === "ACTIVE"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700">
                            {new Date(user.lastActivity).toLocaleString()}
                          </td>
                          <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setEditUser(user);
                                  setIsEditModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800"
                                aria-label={`Edit user ${user.username}`}
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
                                  setDeleteUser(user);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                                aria-label={`Delete user ${user.username}`}
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
                </table>
              </div>
            </div>

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
                    onClick={() => setPage(p)}
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

        {/* Modals */}
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setFormErrors({});
            setNewUser({
              username: "",
              email: "",
              mobileNumber: "",
              role: "SUPERADMIN",
              status: "ACTIVE",
            });
          }}
          onSave={handleAddUser}
          newUser={newUser}
          setNewUser={setNewUser}
          formErrors={formErrors}
        />
        <EditUserModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditUser(null);
            setFormErrors({});
          }}
          onSave={handleEditUser}
          editUser={editUser}
          setEditUser={setEditUser}
          formErrors={formErrors}
        />
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeleteUser(null);
          }}
          onDelete={handleDeleteUser}
          user={deleteUser}
        />
      </div>
    </div>
  );
};

// Map header to sort key
const headerToKey = {
  "#": "id",
  Username: "username",
  Email: "email",
  "Mobile Number": "mobileNumber",
  Role: "role",
  Status: "status",
  "Last Activity": "lastActivity",
};

export default SystemUsersPage;
