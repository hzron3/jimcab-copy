"use client";

import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Link from "next/link";
import Breadcrumb from "./BreadCrumb";

export default function Header({
  isSidebarCollapsed,
  isSidebarOpen,
  toggleSidebar,
}) {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-20">
      <div className="flex items-center justify-between h-18">
        {/* Breadcrumb aligned with sidebar's right edge */}
        <div
          className={`flex-1 ${
            isSidebarCollapsed ? "lg:ml-[3rem]" : "lg:ml-[13rem]"
          } transition-all duration-300 pl-4 sm:pl-6`}
        >
          <Breadcrumb
            isSidebarCollapsed={isSidebarCollapsed}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </div>

        {/* Profile Dropdown */}
        <div className="pr-4 sm:pr-6 lg:pr-8">
          <Menu as="div" className="relative">
            <MenuButton className="text-gray-600 hover:text-gray-900 transition-colors">
              <FaUserCircle size={32} />
            </MenuButton>
            <MenuItems className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem>
                <div className="block px-4 py-2 text-sm text-gray-700 font-medium">
                  User Name
                </div>
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <Link
                    href="/logout"
                    className={`block px-4 py-2 text-sm text-gray-700 flex items-center space-x-2 ${
                      active ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  >
                    <FaSignOutAlt size={16} />
                    <span>Sign Out</span>
                  </Link>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </header>
  );
}
