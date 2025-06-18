"use client";

import React, { useReducer, useEffect, useMemo, useCallback } from "react";
import {
  DocumentTextIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/solid";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";
import debounce from "lodash/debounce";

// Mock invoice data
const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    agency: "Acme Corp",
    status: "Paid",
    totalAmount: 1500.0,
    dueDate: "2025-06-15",
    createdAt: "2025-06-01T10:00:00Z",
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    agency: "Beta Agency",
    status: "Pending",
    totalAmount: 2500.5,
    dueDate: "2025-06-20",
    createdAt: "2025-06-05T12:00:00Z",
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    agency: "Gamma Ltd",
    status: "Overdue",
    totalAmount: 1000.75,
    dueDate: "2025-06-10",
    createdAt: "2025-05-28T09:00:00Z",
  },
];

// Mock API function
const fetchInvoices = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockInvoices;
};

// State reducer
const initialState = {
  invoices: [],
  filteredInvoices: [],
  loading: true,
  error: null,
  search: "",
  sortConfig: { key: "createdAt", direction: "desc" },
  page: 0,
  filters: {
    status: [],
    dueDateStart: "",
    dueDateEnd: "",
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_INVOICES":
      return {
        ...state,
        invoices: action.payload,
        filteredInvoices: action.payload,
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 0 };
    case "SET_SORT":
      return { ...state, sortConfig: action.payload };
    case "SET_FILTERED_INVOICES":
      return { ...state, filteredInvoices: action.payload, page: 0 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        page: 0,
      };
    case "CLEAR_FILTERS":
      return {
        ...state,
        search: "",
        filters: { status: [], dueDateStart: "", dueDateEnd: "" },
        page: 0,
      };
    default:
      return state;
  }
};

const InvoicesPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    invoices,
    filteredInvoices,
    loading,
    error,
    search,
    sortConfig,
    page,
    filters,
  } = state;
  const rowsPerPage = 10;

  // Fetch invoices
  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices();
        dispatch({ type: "SET_INVOICES", payload: data });
      } catch (err) {
        toast.error("Failed to load invoices");
        dispatch({ type: "SET_ERROR", payload: "Failed to load invoices" });
      }
    };
    loadInvoices();
  }, []);

  // Apply filters and search
  const applyFilters = useMemo(
    () =>
      debounce(() => {
        let filtered = [...invoices];

        // Search
        if (search) {
          filtered = filtered.filter(
            (invoice) =>
              invoice.invoiceNumber
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              invoice.agency.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Status
        if (filters.status.length > 0) {
          filtered = filtered.filter((invoice) =>
            filters.status.includes(invoice.status)
          );
        }

        // Due Date
        if (filters.dueDateStart || filters.dueDateEnd) {
          filtered = filtered.filter((invoice) => {
            const dueDate = new Date(invoice.dueDate).getTime();
            const start = filters.dueDateStart
              ? new Date(filters.dueDateStart).getTime()
              : -Infinity;
            const end = filters.dueDateEnd
              ? new Date(filters.dueDateEnd).getTime()
              : Infinity;
            return dueDate >= start && dueDate <= end;
          });
        }

        dispatch({ type: "SET_FILTERED_INVOICES", payload: filtered });
      }, 300),
    [invoices, search, filters]
  );

  useEffect(() => {
    applyFilters();
    return () => applyFilters.cancel();
  }, [applyFilters]);

  // Handle sorting
  const handleSort = useCallback(
    (key) => {
      let direction = "asc";
      if (sortConfig.key === key && sortConfig.direction === "asc") {
        direction = "desc";
      }
      const sorted = [...filteredInvoices].sort((a, b) => {
        if (key === "totalAmount") {
          return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
        }
        const valA = a[key].toString().toLowerCase();
        const valB = b[key].toString().toLowerCase();
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
      dispatch({ type: "SET_SORT", payload: { key, direction } });
      dispatch({ type: "SET_FILTERED_INVOICES", payload: sorted });
    },
    [filteredInvoices, sortConfig]
  );

  // Calculate stats
  const stats = useMemo(() => {
    const total = invoices.length;
    const paid = invoices.filter((inv) => inv.status === "Paid").length;
    const pending = invoices.filter((inv) => inv.status === "Pending").length;
    const overdue = invoices.filter((inv) => inv.status === "Overdue").length;
    const totalAmount = invoices
      .reduce((sum, inv) => sum + inv.totalAmount, 0)
      .toFixed(2);
    return { total, paid, pending, overdue, totalAmount };
  }, [invoices]);

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      "Invoice #",
      "Agency",
      "Status",
      "Total Amount",
      "Due Date",
    ];
    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      inv.agency,
      inv.status,
      `$${inv.totalAmount.toFixed(2)}`,
      new Date(inv.dueDate).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV exported successfully");
  };

  // Status options for react-select
  const statusOptions = [
    { value: "Paid", label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Overdue", label: "Overdue" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 w-full animate-fade-in">
      <Toaster position="top-right" />
      <div className="mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                  Invoices
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Monitor and analyze your invoice data
                </p>
              </div>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 flex items-center gap-2 text-sm font-medium"
              aria-label="Export invoices to CSV"
            >
              <ArrowDownTrayIcon className="h-5 w-5" /> Export CSV
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Invoices",
              value: stats.total,
              bgColor: "bg-gradient-to-br from-indigo-600 to-indigo-800",
              icon: DocumentTextIcon,
            },
            {
              label: "Paid",
              value: stats.paid,
              bgColor: "bg-gradient-to-br from-green-600 to-green-800",
              icon: DocumentTextIcon,
            },
            {
              label: "Pending",
              value: stats.pending,
              bgColor: "bg-gradient-to-br from-yellow-500 to-yellow-700",
              icon: DocumentTextIcon,
            },
            {
              label: "Overdue",
              value: stats.overdue,
              bgColor: "bg-gradient-to-br from-red-600 to-red-800",
              icon: DocumentTextIcon,
            },
            {
              label: "Total Amount",
              value: `$${stats.totalAmount}`,
              bgColor: "bg-gradient-to-br from-blue-600 to-blue-800",
              icon: CurrencyDollarIcon,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bgColor} rounded-2xl shadow-lg text-white p-4 sm:p-5 flex items-center gap-4 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ease-in-out`}
            >
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm flex-shrink-0">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium uppercase tracking-wide opacity-90">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <Select
                id="status-filter"
                isMulti
                options={statusOptions}
                value={statusOptions.filter((option) =>
                  filters.status.includes(option.value)
                )}
                onChange={(selected) =>
                  dispatch({
                    type: "SET_FILTERS",
                    payload: {
                      status: selected ? selected.map((s) => s.value) : [],
                    },
                  })
                }
                className="text-sm"
                classNamePrefix="react-select"
                placeholder="Select status..."
                aria-label="Filter by status"
              />
            </div>

            {/* Due Date Start */}
            <div>
              <label
                htmlFor="dueDateStart"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date Start
              </label>
              <input
                id="dueDateStart"
                type="date"
                value={filters.dueDateStart}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FILTERS",
                    payload: { dueDateStart: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-50 transition duration-200 shadow-sm"
                aria-label="Filter by due date start"
              />
            </div>

            {/* Due Date End */}
            <div>
              <label
                htmlFor="dueDateEnd"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Due Date End
              </label>
              <input
                id="dueDateEnd"
                type="date"
                value={filters.dueDateEnd}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FILTERS",
                    payload: { dueDateEnd: e.target.value },
                  })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-50 transition duration-200 shadow-sm"
                aria-label="Filter by due date end"
              />
            </div>

            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Invoice number or agency..."
                value={search}
                onChange={(e) =>
                  dispatch({ type: "SET_SEARCH", payload: e.target.value })
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-gray-50 transition duration-200 shadow-sm"
                aria-label="Search invoices"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 text-sm font-medium"
              aria-label="Clear all filters and search"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Invoices Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <svg
              className="animate-spin h-8 w-8 text-indigo-600"
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
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
              />
            </svg>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Invoice List
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        { label: "Invoice #", key: "invoiceNumber" },
                        { label: "Agency", key: "agency" },
                        { label: "Status", key: "status" },
                        { label: "Total Amount", key: "totalAmount" },
                        { label: "Due Date", key: "dueDate" },
                      ].map((header) => (
                        <th
                          key={header.label}
                          scope="col"
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                          onClick={() => header.key && handleSort(header.key)}
                          aria-sort={
                            header.key && sortConfig.key === header.key
                              ? sortConfig.direction
                              : "none"
                          }
                        >
                          <div className="flex items-center gap-1">
                            {header.label}
                            {header.key && sortConfig.key === header.key && (
                              <span aria-hidden="true">
                                {sortConfig.direction === "asc" ? "↑" : "↓"}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-sm text-gray-500"
                        >
                          No invoices found. Try adjusting your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((invoice, index) => (
                          <tr
                            key={invoice.id}
                            className={`transition duration-200 ${
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-indigo-50`}
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {invoice.invoiceNumber}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                              {invoice.agency}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  invoice.status === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : invoice.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                              ${invoice.totalAmount.toFixed(2)}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredInvoices.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {page * rowsPerPage + 1} to{" "}
              {Math.min((page + 1) * rowsPerPage, filteredInvoices.length)} of{" "}
              {filteredInvoices.length} invoices
            </div>
            <div className="flex gap-2">
              {Array.from({
                length: Math.ceil(filteredInvoices.length / rowsPerPage),
              }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => dispatch({ type: "SET_PAGE", payload: i })}
                  className={`px-3 py-1.5 text-sm rounded-lg ${
                    page === i
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-gray-600 border border-gray-300 hover:bg-indigo-50"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200`}
                  aria-label={`Go to page ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesPage;
