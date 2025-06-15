"use client";

import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaTachometerAlt,
  FaUsers,
  FaUser,
  FaCalendarAlt,
  FaFileInvoice,
  FaMap,
  FaCar,
  FaMoneyBillWave,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hardcoded role for demo; replace with your role logic (e.g., context, props, or auth)
  const role = "admin"; // TODO: Implement role logic here

  // Define navigation links with icons based on role
  const links =
    role === "admin"
      ? [
          {
            section: "General",
            items: [
              { href: "/admin", label: "Dashboard", icon: <FaTachometerAlt /> },
              { href: "/admin/clients", label: "Clients", icon: <FaUsers /> },
              {
                href: "/admin/app-users",
                label: "App Users",
                icon: <FaUser />,
              },
              {
                href: "/admin/bookings",
                label: "Bookings",
                icon: <FaCalendarAlt />,
              },
              {
                href: "/admin/shifts",
                label: "Shifts",
                icon: <FaCalendarAlt />,
              },
              {
                href: "/admin/invoices",
                label: "Invoices",
                icon: <FaFileInvoice />,
              },
            ],
          },
          {
            section: "Settings",
            items: [
              {
                href: "/admin/system-users",
                label: "System Users",
                icon: <FaUsers />,
              },
              { href: "/admin/zones", label: "Zones", icon: <FaMap /> },
              { href: "/admin/drivers", label: "Drivers", icon: <FaUser /> },
              { href: "/admin/vehicles", label: "Vehicles", icon: <FaCar /> },
              {
                href: "/admin/tariffs",
                label: "Tariffs",
                icon: <FaMoneyBillWave />,
              },
            ],
          },
        ]
      : role === "driver"
      ? [
          {
            section: "General",
            items: [
              {
                href: "/drivers",
                label: "Dashboard",
                icon: <FaTachometerAlt />,
              },
              {
                href: "/drivers/bookings",
                label: "Bookings",
                icon: <FaCalendarAlt />,
              },
              {
                href: "/drivers/shifts",
                label: "Shifts",
                icon: <FaCalendarAlt />,
              },
            ],
          },
          {
            section: "Settings",
            items: [
              { href: "/drivers/profile", label: "Profile", icon: <FaUser /> },
              { href: "/drivers/vehicle", label: "Vehicle", icon: <FaCar /> },
            ],
          },
        ]
      : [];

  // Close sidebar on navigation link click
  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 p-2 mt-0 mx-2 text-white bg-blue-600 rounded-lg md:hidden hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 z-40 shadow-xl flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-center">
          <img
            src="/JimcabLogo.webp"
            alt="JimCab Logo"
            className="h-8 w-auto"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.length > 0 ? (
            links.map((section) => (
              <div key={section.section} className="space-y-1">
                <div className="text-xs font-semibold text-gray-400 uppercase px-3 py-2">
                  {section.section}
                </div>
                {section.items.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-100 transition-colors ${
                      pathname === link.href
                        ? "bg-blue-100 border-l-4 border-blue-600 text-blue-600 font-medium"
                        : ""
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>
            ))
          ) : (
            <p className="p-3 text-gray-500 text-sm">No role assigned.</p>
          )}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
