"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import {
  PlusIcon,
  MapIcon,
  PencilIcon,
  TrashIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import ZoneModals from "@/app/components/ZoneModals";

// Dynamically import react-leaflet components with SSR disabled
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
);
const Polygon = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  {
    ssr: false,
  }
);

// Dynamically import Leaflet
const L = dynamic(() => import("leaflet").then((mod) => mod.default), {
  ssr: false,
});

// Mock zone data with boundaries
const mockZones = [
  {
    id: 1,
    name: "Westlands Zone",
    leadTime: 0,
    backupZones: ["Nairobi CBD"],
    createdAt: "2025-06-17T14:07:05",
    color: "#FF0000",
    boundaries: [
      [-1.265, 36.802],
      [-1.26, 36.81],
      [-1.27, 36.815],
      [-1.275, 36.805],
    ],
  },
  {
    id: 2,
    name: "Hurlingham",
    leadTime: 30,
    backupZones: ["Nairobi CBD"],
    createdAt: "2025-06-14T13:24:15",
    color: "#FF0000",
    boundaries: [
      [-1.295, 36.799],
      [-1.29, 36.805],
      [-1.3, 36.81],
      [-1.305, 36.8],
    ],
  },
  {
    id: 3,
    name: "Karen Zone",
    leadTime: 20,
    backupZones: [],
    createdAt: "2025-06-12T14:49:46",
    color: "#FF0000",
    boundaries: [
      [-1.32, 36.71],
      [-1.315, 36.72],
      [-1.325, 36.725],
      [-1.33, 36.715],
    ],
  },
  {
    id: 4,
    name: "Kasarani Zone",
    leadTime: 20,
    backupZones: ["Nairobi CBD"],
    createdAt: "2025-06-12T10:55:57",
    color: "#FF0000",
    boundaries: [
      [-1.23, 36.9],
      [-1.225, 36.91],
      [-1.235, 36.915],
      [-1.24, 36.905],
    ],
  },
  {
    id: 5,
    name: "Kikuyu Road",
    leadTime: 30,
    backupZones: [],
    createdAt: "2025-06-04T11:49:18",
    color: "#FF0000",
    boundaries: [
      [-1.28, 36.67],
      [-1.275, 36.68],
      [-1.285, 36.685],
      [-1.29, 36.675],
    ],
  },
  {
    id: 6,
    name: "Gigiri Zone",
    leadTime: 30,
    backupZones: ["Westlands Zone", "Nairobi CBD"],
    createdAt: "2025-05-30T09:24:14",
    color: "#FF0000",
    boundaries: [
      [-1.23, 36.83],
      [-1.225, 36.84],
      [-1.235, 36.845],
      [-1.24, 36.835],
    ],
  },
  {
    id: 7,
    name: "Nairobi CBD",
    leadTime: 30,
    backupZones: [],
    createdAt: "2025-05-21T15:52:50",
    color: "#FF0000",
    boundaries: [
      [-1.286, 36.817],
      [-1.281, 36.827],
      [-1.291, 36.832],
      [-1.296, 36.822],
    ],
  },
  {
    id: 8,
    name: "Lower Kabete Zone",
    leadTime: 30,
    createdAt: "2025-04-30T15:48:28",
    backupZones: [],
    color: "#FF0000",
    boundaries: [
      [-1.27, 36.75],
      [-1.265, 36.76],
      [-1.275, 36.765],
      [-1.28, 36.755],
    ],
  },
];

// Mock API function
const fetchZones = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return mockZones;
};

const ZonesPage = () => {
  const [zones, setZones] = useState([]);
  const [filteredZones, setFilteredZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);
  const [newZone, setNewZone] = useState({
    name: "",
    leadTime: "",
    backupZones: [],
    color: "#FF0000",
    boundaries: [],
  });
  const [editZone, setEditZone] = useState(null);
  const [deleteZone, setDeleteZone] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const mapRef = useRef(null);

  // Fix Leaflet default icon paths
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/leaflet/marker-icon-2x.png",
          iconUrl: "/leaflet/marker-icon.png",
          shadowUrl: "/leaflet/marker-shadow.png",
        });
      });
    }
  }, []);

  // Fetch zones on mount
  useEffect(() => {
    const loadZones = async () => {
      try {
        const data = await fetchZones();
        setZones(data);
        setFilteredZones(data);
      } catch (error) {
        console.error("Error fetching zones:", error);
      } finally {
        setLoading(false);
      }
    };
    loadZones();
  }, []);

  // Handle search
  useEffect(() => {
    let filtered = [...zones];
    if (search) {
      filtered = filtered.filter((zone) =>
        zone.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredZones(filtered);
    setPage(0);
  }, [search, zones]);

  // Handle zone click to display map
  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    if (
      mapRef.current &&
      zone.boundaries.length > 0 &&
      typeof L !== "undefined"
    ) {
      const bounds = L.latLngBounds(zone.boundaries);
      mapRef.current.fitBounds(bounds);
    }
  };

  // Validate form
  const validateForm = (zone) => {
    const errors = {};
    if (!zone.name.trim()) errors.name = "Zone Name is required";
    if (
      !zone.leadTime ||
      isNaN(parseInt(zone.leadTime)) ||
      parseInt(zone.leadTime) < 0
    )
      errors.leadTime = "Valid Lead Time is required";
    if (zone.boundaries.length < 3)
      errors.boundaries = "At least 3 boundary points are required";
    return errors;
  };

  // Handle add zone
  const handleAddZone = () => {
    const errors = validateForm(newZone);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newId = Math.max(...zones.map((z) => z.id), 0) + 1;
    const newZoneData = {
      id: newId,
      ...newZone,
      leadTime: parseInt(newZone.leadTime),
      createdAt: new Date().toISOString(),
    };
    setZones([...zones, newZoneData]);
    setFilteredZones([...filteredZones, newZoneData]);
    setNewZone({
      name: "",
      leadTime: "",
      backupZones: [],
      color: "#FF0000",
      boundaries: [],
    });
    setFormErrors({});
    setIsAddModalOpen(false);
  };

  // Handle edit zone
  const handleEditZone = () => {
    const errors = validateForm(editZone);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const updatedZones = zones.map((z) =>
      z.id === editZone.id
        ? {
            ...editZone,
            leadTime: parseInt(editZone.leadTime),
            createdAt: z.createdAt,
          }
        : z
    );
    setZones(updatedZones);
    setFilteredZones(updatedZones);
    setEditZone(null);
    setFormErrors({});
    setIsEditModalOpen(false);
  };

  // Handle delete zone
  const handleDeleteZone = () => {
    const updatedZones = zones.filter((z) => z.id !== deleteZone.id);
    setZones(updatedZones);
    setFilteredZones(updatedZones);
    setDeleteZone(null);
    setIsDeleteModalOpen(false);
    setSelectedZone(null);
  };

  // Pagination
  const pageCount = Math.ceil(filteredZones.length / rowsPerPage);
  const pages = Array.from({ length: pageCount }, (_, i) => i);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 w-full">
      <div className="w-full">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <MapIcon className="h-8 w-8 sm:h-10 sm:w-10 text-indigo-600 flex-shrink-0" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Zones Management
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Manage and monitor zones
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsViewAllModalOpen(true)}
                className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out w-28 sm:w-40"
              >
                <GlobeAltIcon className="h-5 w-5 inline mr-1" /> View All Zones
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 text-xs sm:text-sm sm:px-4 sm:py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded Haunted-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out w-28 sm:w-40"
              >
                <PlusIcon className="h-5 w-5 inline mr-1" /> Add Zone
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <input
            type="text"
            placeholder="Search by zone name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 hover:bg-indigo-50 transition duration-300 ease-in-out"
          />
        </div>

        {/* Zone Details */}
        {selectedZone && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Zone Details: {selectedZone.name}
              </h3>
              <button
                onClick={() => setSelectedZone(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-96">
                {typeof window !== "undefined" && (
                  <MapContainer
                    center={selectedZone.boundaries[0] || [-1.2864, 36.8172]}
                    zoom={13}
                    style={{ height: "100%", width: "100%" }}
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {selectedZone.boundaries.length > 0 && (
                      <Polygon
                        positions={selectedZone.boundaries}
                        pathOptions={{
                          color: selectedZone.color,
                          fillOpacity: 0.4,
                        }}
                      />
                    )}
                  </MapContainer>
                )}
              </div>
              <div className="space-y-2">
                <p>
                  <strong>Color:</strong> {selectedZone.color}
                </p>
                <p>
                  <strong>Lead Time:</strong> {selectedZone.leadTime} minutes
                </p>
                <p>
                  <strong>Backup Zones:</strong>{" "}
                  {selectedZone.backupZones.join(", ") || "None"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(selectedZone.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Zones Table */}
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
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                All Zones
              </h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      "Name",
                      "Lead Time (minutes)",
                      "Backup Zones",
                      "Created At",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredZones
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((zone, index) => (
                      <tr
                        key={zone.id}
                        className={`transition duration-300 ease-in-out cursor-pointer ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50`}
                        onClick={() => handleZoneClick(zone)}
                      >
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                          {zone.name}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                          {zone.leadTime}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                          {zone.backupZones.join(", ") || "None"}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                          {new Date(zone.createdAt).toLocaleString()}
                        </td>
                        <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm sm:text-base">
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditZone(zone);
                                setIsEditModalOpen(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-800"
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
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteZone(zone);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <div className="text-sm sm:text-base text-gray-600">
            Showing {page * rowsPerPage + 1} to{" "}
            {Math.min((page + 1) * rowsPerPage, filteredZones.length)} of{" "}
            {filteredZones.length} zones
          </div>
          <div className="flex gap-1 flex-wrap justify-center">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-sm sm:text-base rounded-lg ${
                  page === p
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 border border-gray-300 hover:bg-indigo-50"
                }`}
              >
                {p + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Modals */}
        <ZoneModals
          isAddModalOpen={isAddModalOpen}
          setIsAddModalOpen={setIsAddModalOpen}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
          isDeleteModalOpen={isDeleteModalOpen}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          isViewAllModalOpen={isViewAllModalOpen}
          setIsViewAllModalOpen={setIsViewAllModalOpen}
          newZone={newZone}
          setNewZone={setNewZone}
          editZone={editZone}
          setEditZone={setEditZone}
          deleteZone={deleteZone}
          setDeleteZone={setDeleteZone}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
          zones={zones}
          handleAddZone={handleAddZone}
          handleEditZone={handleEditZone}
          handleDeleteZone={handleDeleteZone}
        />
      </div>
    </div>
  );
};

export default ZonesPage;
