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

export default function AdminDashboard() {
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

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Admin Dashboard Overview
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 max-w-full">
          {overviewData.map((item) => (
            <div
              key={item.label}
              className={`bg-white p-4 sm:p-6 rounded-xl shadow-lg flex items-center space-x-4 ${item.colors.hover} transition-colors duration-300 max-w-full`}
            >
              {item.icon}
              <div className="flex-1">
                <h2 className="text-sm sm:text-base font-semibold text-gray-800">
                  {item.label}
                </h2>
                <p
                  className={`text-xl sm:text-2xl font-bold ${item.colors.value}`}
                >
                  {item.value.toLocaleString()}
                </p>
                <Link
                  href={item.href}
                  className={`${item.colors.icon} hover:underline text-xs sm:text-sm inline-flex items-center focus:ring-2 ${item.colors.focus}`}
                >
                  Manage {item.label}{" "}
                  <FaArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
