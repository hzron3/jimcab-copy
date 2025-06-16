"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaChevronRight, FaBars, FaTimes } from "react-icons/fa";

export default function Breadcrumb({
  isSidebarCollapsed,
  isSidebarOpen,
  toggleSidebar,
}) {
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

  // Generate breadcrumb based on pathname
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter((path) => path);
    const breadcrumbs = [{ href: "/", label: "Home" }];

    if (paths[0] === "admin") {
      breadcrumbs.push({ href: "/admin", label: "Admin" });
      if (paths[1]) {
        const label = paths[1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        breadcrumbs.push({ href: pathname, label });
      }
    } else if (paths[0] === "drivers") {
      breadcrumbs.push({ href: "/drivers", label: "Driver" });
      if (paths[1]) {
        const label = paths[1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        breadcrumbs.push({ href: pathname, label });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600">
      {/* Sidebar Toggle (All Screens) */}
      <button
        onClick={toggleSidebar}
        className="text-gray-600 hover:text-gray-900 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isMobile && isSidebarOpen ? (
          <FaTimes size={20} />
        ) : (
          <FaBars size={20} />
        )}
      </button>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          <Link
            href={crumb.href}
            className={`hover:text-blue-600 ${
              index === breadcrumbs.length - 1
                ? "text-blue-600 font-medium"
                : ""
            }`}
          >
            {crumb.label}
          </Link>
          {index < breadcrumbs.length - 1 && (
            <FaChevronRight className="mx-2 text-gray-400" size={12} />
          )}
        </div>
      ))}
    </nav>
  );
}
