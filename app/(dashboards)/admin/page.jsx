"use client";

import {
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaMap,
  FaBook,
  FaArrowRight,
} from "react-icons/fa";
import Link from "next/link";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components to minimize bundle size
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboard() {
  // Mock data for Active Drivers
  const activeDriversData = [
    {
      driverName: "John Doe",
      driverNumber: "D001",
      badgeNumber: "B12345",
      status: "Active",
      currentVehicle: "Toyota Camry",
      activeShift: "Shift #123",
    },
    {
      driverName: "Jane Smith",
      driverNumber: "D002",
      badgeNumber: "B67890",
      status: "On Break",
      currentVehicle: "Honda Accord",
      activeShift: "Shift #124",
    },
    {
      driverName: "Mike Johnson",
      driverNumber: "D003",
      badgeNumber: "B11223",
      status: "Active",
      currentVehicle: "Ford Explorer",
      activeShift: "Shift #125",
    },
  ];

  // Mock data for Active Shifts
  const activeShiftsData = [
    {
      driverName: "John Doe",
      vehicleAllocated: "Toyota Camry",
      jobsDone: 12,
      status: "Active",
      timeStarted: "2025-06-16 08:00",
      totalTimeOnline: "4h 21m",
    },
    {
      driverName: "Jane Smith",
      vehicleAllocated: "Honda Accord",
      jobsDone: 8,
      status: "Paused",
      timeStarted: "2025-06-16 07:30",
      totalTimeOnline: "3h 15m",
    },
    {
      driverName: "Mike Johnson",
      vehicleAllocated: "Ford Explorer",
      jobsDone: 15,
      status: "Active",
      timeStarted: "2025-06-16 09:00",
      totalTimeOnline: "2h 45m",
    },
  ];

  // Mock data for Sales per Client (Agency)
  const salesChartData = {
    labels: ["Acme Corp", "Beta Ltd", "Gamma Group", "Delta PLC"],
    datasets: [
      {
        label: "Sales (Ksh)",
        data: [150, 90, 120, 60],
        backgroundColor: ["#2dd4bf", "#14b8a6", "#0d9488", "#0f766e"],
        borderColor: ["#0d9488", "#0f766e", "#065f46", "#064e3b"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#1f2937", font: { size: 14 } },
      },
      tooltip: {
        backgroundColor: "#f3f4f6",
        titleColor: "#1f2937",
        bodyColor: "#1f2937",
        callbacks: {
          label: (context) => `${context.raw}K`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#1f2937", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: "#1f2937",
          font: { size: 12 },
          callback: (value) => `${value}K`,
        },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  const overviewData = [
    {
      label: "Drivers",
      value: 120,
      icon: <FaUser className="h-6 w-6 text-blue-600 flex-shrink-0" />,
      href: "/admin/drivers",
      colors: {
        icon: "text-blue-600",
        value: "text-blue-800",
        hover: "hover:bg-blue-50",
        focus: "focus:ring-blue-600",
      },
    },
    {
      label: "Staff/Admins",
      value: 14,
      icon: <FaUsers className="h-6 w-6 text-red-600 flex-shrink-0" />,
      href: "/admin/system-users",
      colors: {
        icon: "text-red-600",
        value: "text-red-800",
        hover: "hover:bg-red-50",
        focus: "focus:ring-red-600",
      },
    },
    {
      label: "Shifts",
      value: 8,
      icon: <FaCalendarAlt className="h-6 w-6 text-sky-500 flex-shrink-0" />,
      href: "/admin/shifts",
      colors: {
        icon: "text-sky-500",
        value: "text-sky-700",
        hover: "hover:bg-sky-50",
        focus: "focus:ring-sky-500",
      },
    },
    {
      label: "Zones",
      value: 5,
      icon: <FaMap className="h-6 w-6 text-green-600 flex-shrink-0" />,
      href: "/admin/zones",
      colors: {
        icon: "text-green-600",
        value: "text-green-800",
        hover: "hover:bg-green-50",
        focus: "focus:ring-green-600",
      },
    },
    {
      label: "Taxi Bookings",
      value: 3200,
      icon: <FaBook className="h-6 w-6 text-purple-600 flex-shrink-0" />,
      href: "/admin/bookings",
      colors: {
        icon: "text-purple-600",
        value: "text-purple-800",
        hover: "hover:bg-purple-50",
        focus: "focus:ring-purple-600",
      },
    },
  ];

  // Updated renderStatusBadge to include Booking statuses
  const renderStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-md text-sm font-medium";
    const statusStyles = {
      Active: "bg-green-100 text-green-800",
      "On Break": "bg-yellow-100 text-yellow-800",
      Paused: "bg-gray-100 text-gray-800",
      Confirmed: "bg-teal-100 text-teal-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`${baseClasses} ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 bg-gray-50 min-h-screen ">
      {/* Dashboard Overview */}
      <section className="mb-12">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-6">
          Admin Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6 max-w-full">
          {overviewData.map((item) => (
            <div
              key={item.label}
              className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 ${item.colors.hover} transition-colors duration-300 max-w-full`}
            >
              {item.icon}
              <div className="flex-1">
                <h2 className="text-base font-semibold text-gray-800">
                  {item.label}
                </h2>
                <p className={`text-2xl font-bold ${item.colors.value}`}>
                  {item.value.toLocaleString()}
                </p>
                <Link
                  href={item.href}
                  className={`${item.colors.icon} hover:underline text-sm inline-flex items-center focus:ring-2 ${item.colors.focus}`}
                >
                  Manage {item.label}{" "}
                  <FaArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Drivers Table */}
      <section className="mb-8 lg:mb-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-sm lg:text-lg font-semibold text-gray-900">
                Active Drivers
              </h1>
              <Link
                href="/admin/drivers"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-colors duration-200"
              >
                View All Drivers
                <FaArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Driver Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Driver Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Badge Number
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Current Vehicle
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Active Shift
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {activeDriversData.map((driver, index) => (
                      <tr
                        key={driver.driverNumber}
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                        }`}
                      >
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {driver.driverName}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {driver.driverNumber}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {driver.badgeNumber}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap">
                          {renderStatusBadge(driver.status)}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {driver.currentVehicle}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {driver.activeShift}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Shifts Table */}
      <section className="mb-8 lg:mb-12">
        <div className="sm:flex-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-sm lg:text-lg font-semibold text-gray-900">
              Active Shifts
            </h1>
            <Link
              href="/admin/shifts"
              className="inline-flex items-center text-sm font-medium text-sky-600 hover:text-sky-800 hover:underline focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 transition-colors duration-200"
            >
              View All Shifts
              <FaArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="mt-4 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Driver Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Vehicle Allocated
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Jobs Done
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Time Started
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Total Time Online
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {activeShiftsData.map((shift, index) => (
                      <tr
                        key={shift.driverName + index}
                        className={`hover:bg-gray-50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                        }`}
                      >
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {shift.driverName}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {shift.vehicleAllocated}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {shift.jobsDone}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap">
                          {renderStatusBadge(shift.status)}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {shift.timeStarted}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {shift.totalTimeOnline}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bookings Table */}
      <section className="mb-8 lg:mb-12">
        <div className="sm:flex-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-sm lg:text-lg font-semibold text-gray-900">
              Bookings
            </h1>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-800 hover:underline focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition-colors duration-200"
            >
              View All Bookings
              <FaArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative overflow-hidden shadow-md ring-1 ring-teal-200 sm:rounded-xl">
                <table className="min-w-full divide-y divide-teal-300">
                  <thead className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                    <tr>
                      <th
                        scope="col"
                        className="py-4 pr-3 pl-4 text-left text-sm font-semibold sm:pl-6"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold"
                      >
                        Booking Id
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold"
                      >
                        Passenger Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold"
                      >
                        Trip Date
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold"
                      >
                        Client
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold"
                      >
                        Stop Overs
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold"
                      >
                        Booking Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-100 bg-white">
                    {[
                      {
                        id: 1,
                        bookingId: "BKG-001",
                        passengerName: "Alice Brown",
                        tripDate: "2025-06-17",
                        client: "Acme Corp",
                        stopOvers: 2,
                        bookingStatus: "Confirmed",
                      },
                      {
                        id: 2,
                        bookingId: "BKG-002",
                        passengerName: "Bob Wilson",
                        tripDate: "2025-06-18",
                        client: "Beta Inc",
                        stopOvers: 1,
                        bookingStatus: "Pending",
                      },
                      {
                        id: 3,
                        bookingId: "BKG-003",
                        passengerName: "Clara Davis",
                        tripDate: "2025-06-19",
                        client: "Gamma Ltd",
                        stopOvers: 0,
                        bookingStatus: "Cancelled",
                      },
                    ].map((booking) => (
                      <tr
                        key={booking.bookingId}
                        className={`hover:bg-teal-50/50 transition-colors duration-200 ${
                          booking.id % 2 === 0 ? "bg-teal-50/20" : "bg-white"
                        }`}
                      >
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {booking.id}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-600">
                          {booking.bookingId}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-600">
                          {booking.passengerName}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-600">
                          {booking.tripDate}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-600">
                          {booking.client}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-600">
                          {booking.stopOvers}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap">
                          {renderStatusBadge(booking.bookingStatus)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zones Table */}
      <section className="mb-8 lg:mb-12">
        <div className="sm:flex-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-sm lg:text-lg font-semibold text-gray-900">
              Zones
            </h1>
            <Link
              href="/admin/zones"
              className="inline-flex items-center text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 transition-colors duration-200"
            >
              View All Zones
              <FaArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="mt-3 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative overflow-hidden shadow-lg ring-1 ring-purple-200 sm:rounded-xl">
                <table className="min-w-full divide-y divide-purple-300">
                  <thead className="bg-purple-100">
                    <tr>
                      <th
                        scope="col"
                        className="py-4 pr-3 pl-4 text-left text-sm font-semibold text-purple-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold text-purple-900"
                      >
                        Lead Time (minutes)
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold text-purple-900"
                      >
                        Backup Zones
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-sm font-semibold text-purple-900"
                      >
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-100 bg-white">
                    {[
                      {
                        name: "Downtown",
                        leadTime: 15,
                        backupZones: "Uptown, Midtown",
                        createdAt: "2025-01-10",
                      },
                      {
                        name: "Uptown",
                        leadTime: 20,
                        backupZones: "Downtown, Suburbs",
                        createdAt: "2025-02-15",
                      },
                      {
                        name: "Suburbs",
                        leadTime: 30,
                        backupZones: "Uptown",
                        createdAt: "2025-03-20",
                      },
                    ].map((zone, index) => (
                      <tr
                        key={zone.name}
                        className={`hover:bg-purple-50/50 transition-colors duration-200 ${
                          index % 2 === 0 ? "bg-purple-50/20" : "bg-white"
                        }`}
                      >
                        <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                          {zone.name}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-600">
                          {zone.leadTime}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-600">
                          {zone.backupZones}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-600">
                          {zone.createdAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sales per Client (Agency) Bar Chart */}
      <section className="mb-3 lg:mb-8">
        <div className="sm:flex-auto">
          <h1 className="ttext-sm lg:text-lg font-semibold text-gray-900">
            Sales per Client (Agency)
          </h1>
        </div>
        <div className="mt-3 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="relative overflow-hidden shadow-md ring-1 ring-teal-200 sm:rounded-xl bg-white">
                <div className="h-80 p-6">
                  <Bar data={salesChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
