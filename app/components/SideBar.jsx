"use client";

import { useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaUser,
  FaCalendarAlt,
  FaFileInvoice,
  FaMap,
  FaCar,
  FaMoneyBillWave,
  FaBook,
} from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar({ isCollapsed, isOpen, setIsOpen }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size on client-side mount
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    // Set initial value
    handleResize();

    // Add resize listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hardcoded role for demo; replace with your role logic
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
              { href: "/admin/bookings", label: "Bookings", icon: <FaBook /> },
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
            section: "Operations",
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
            section: "Profile Management",
            items: [
              { href: "/drivers/profile", label: "Profile", icon: <FaUser /> },
              { href: "/drivers/vehicle", label: "Vehicle", icon: <FaCar /> },
            ],
          },
        ]
      : [];

  // Close sidebar on navigation link click (mobile only)
  const handleNavClick = () => {
    if (isMobile && isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 ${
          isMobile ? "w-54" : isCollapsed ? "w-16" : "w-54"
        } bg-white transform ${
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
        } md:translate-x-0 transition-all duration-300 z-40 shadow-xl flex flex-col`}
      >
        {/* Header */}
        <div
          className={`p-4 py-6 border-b border-gray-200 flex justify-center ${
            !isMobile && isCollapsed ? "px-2" : ""
          }`}
        >
          <img
            src="/JimcabLogo.webp"
            alt="JimCab Logo"
            className={`${
              !isMobile && isCollapsed ? "h-8 w-8" : "h-10 w-auto"
            }`}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {links.length > 0 ? (
            links.map((section) => (
              <div key={section.section} className="space-y-2">
                <div
                  className={`text-sm sm:text-lg font-bold text-blue-900 uppercase px-3 py-2 tracking-wide border-b border-gray-100 ${
                    !isMobile && isCollapsed ? "hidden" : ""
                  }`}
                >
                  {section.section}
                </div>
                {section.items.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleNavClick}
                    className={`flex items-center ${
                      !isMobile && isCollapsed ? "justify-center" : "space-x-3"
                    } p-3 rounded-lg text-gray-700 hover:bg-blue-50 transition-colors ${
                      pathname === link.href
                        ? "bg-blue-50 border-l-4 border-blue-600 text-blue-600 font-semibold"
                        : ""
                    }`}
                    title={!isMobile && isCollapsed ? link.label : ""}
                  >
                    <span className="text-lg">{link.icon}</span>
                    {(!isMobile || isMobile) && !(!isMobile && isCollapsed) && (
                      <span>{link.label}</span>
                    )}
                  </Link>
                ))}
              </div>
            ))
          ) : (
            <p
              className={`p-3 text-gray-500 text-sm ${
                !isMobile && isCollapsed ? "hidden" : ""
              }`}
            >
              No role assigned.
            </p>
          )}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
