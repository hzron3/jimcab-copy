"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DashboardLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated");
    if (isAuthenticated !== "true") {
      router.push("/");
    }
  }, [router]);

  const toggleSidebar = () => {
    // On mobile, toggle open/close; on desktop, toggle collapse/expand
    setIsSidebarOpen((prev) => !prev);
    setIsSidebarCollapsed((prev) => !prev);
  };

  // Logout handler
  const handleLogout = () => {
    sessionStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleLogout={handleLogout} // Pass logout handler to Header
      />

      {/* Main Layout */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <SideBar
          isCollapsed={isSidebarCollapsed}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          handleLogout={handleLogout} // Pass logout handler to SideBar (optional)
        />

        {/* Main Content */}
        <main
          className={`flex-1 overflow-y-auto py-4 ${
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-54"
          } transition-all duration-300`}
        >
          <div>{children}</div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
