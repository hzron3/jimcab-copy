import React, { useRef, useEffect, useCallback, useState, memo } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import debounce from "lodash/debounce";

const ZoneModals = ({
  isAddModalOpen,
  setIsAddModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  isViewAllModalOpen,
  setIsViewAllModalOpen,
  newZone,
  setNewZone,
  editZone,
  setEditZone,
  deleteZone,
  setDeleteZone,
  formErrors,
  setFormErrors,
  zones,
  handleAddZone,
  handleEditZone,
  handleDeleteZone,
}) => {
  const addMapRef = useRef(null);
  const editMapRef = useRef(null);
  const viewAllMapRef = useRef(null);
  const nameInputRef = useRef(null);
  const leadTimeInputRef = useRef(null);
  const [activeInput, setActiveInput] = useState(null);

  // Debounced map click handler
  const debouncedSetBoundaries = useCallback(
    debounce((setZone, latlng) => {
      setZone((prev) => ({
        ...prev,
        boundaries: [...prev.boundaries, [latlng.lat, latlng.lng]],
      }));
    }, 100),
    []
  );

  const MapEvents = ({ setZone }) => {
    useMapEvents({
      click(e) {
        // Prevent map clicks from stealing focus from inputs
        if (
          document.activeElement === nameInputRef.current ||
          document.activeElement === leadTimeInputRef.current
        ) {
          return;
        }
        debouncedSetBoundaries(setZone, e.latlng);
      },
    });
    return null;
  };

  const handleClearBoundaries = (setZone) => {
    setZone((prev) => ({ ...prev, boundaries: [] }));
  };

  // Auto-fit bounds for View All Zones
  useEffect(() => {
    if (isViewAllModalOpen && viewAllMapRef.current && zones.length > 0) {
      const allBounds = zones
        .filter((zone) => zone.boundaries.length > 0)
        .map((zone) => L.latLngBounds(zone.boundaries));
      if (allBounds.length > 0) {
        const combinedBounds = allBounds.reduce((acc, bounds) =>
          acc.extend(bounds)
        );
        viewAllMapRef.current.fitBounds(combinedBounds);
      }
    }
  }, [isViewAllModalOpen, zones]);

  // Restore focus after re-render
  useEffect(() => {
    if (activeInput === "name" && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (activeInput === "leadTime" && leadTimeInputRef.current) {
      leadTimeInputRef.current.focus();
    }
  }, [activeInput, newZone, editZone]);

  // Shared Modal Container
  const ModalContainer = ({
    children,
    onClose,
    title,
    maxWidth = "max-w-4xl",
  }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-6">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] flex flex-col overflow-hidden`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
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
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );

  // Memoized Form Content
  const ZoneForm = memo(({ zone, setZone, formErrors, isEdit = false }) => {
    const handleNameChange = useCallback(
      (e) => {
        setZone((prev) => ({ ...prev, name: e.target.value }));
      },
      [setZone]
    );

    const handleLeadTimeChange = useCallback(
      (e) => {
        setZone((prev) => ({ ...prev, leadTime: e.target.value }));
      },
      [setZone]
    );

    const handleBackupZonesChange = useCallback(
      (e) => {
        setZone((prev) => ({
          ...prev,
          backupZones: Array.from(
            e.target.selectedOptions,
            (option) => option.value
          ),
        }));
      },
      [setZone]
    );

    const handleColorChange = useCallback(
      (e) => {
        setZone((prev) => ({ ...prev, color: e.target.value }));
      },
      [setZone]
    );

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zone Name
            </label>
            <input
              type="text"
              value={zone?.name || ""}
              onChange={handleNameChange}
              onFocus={() => setActiveInput("name")}
              ref={nameInputRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm transition-colors"
              placeholder="Enter zone name"
            />
            {formErrors.name && (
              <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead Time (minutes)
            </label>
            <input
              type="number"
              value={zone?.leadTime || ""}
              onChange={handleLeadTimeChange}
              onFocus={() => setActiveInput("leadTime")}
              ref={leadTimeInputRef}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm transition-colors"
              placeholder="Enter lead time"
            />
            {formErrors.leadTime && (
              <p className="text-red-500 text-xs mt-1">{formErrors.leadTime}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Backup Zones
            </label>
            <select
              multiple
              value={zone?.backupZones || []}
              onChange={handleBackupZonesChange}
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm transition-colors"
            >
              {zones
                .filter((z) => !isEdit || z.id !== zone?.id)
                .map((z) => (
                  <option key={z.id} value={z.name} className="py-1">
                    {z.name}
                  </option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Hold Ctrl (Cmd on Mac) to select multiple zones
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zone Color
            </label>
            <input
              type="color"
              value={zone?.color || "#FF0000"}
              onChange={handleColorChange}
              className="w-16 h-10 border border-gray-300 rounded-lg shadow-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zone Boundaries
          </label>
          <div className="h-[350px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <MapContainer
              center={zone?.boundaries[0] || [-1.2864, 36.8172]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              ref={isEdit ? editMapRef : addMapRef}
              dragging={!(activeInput === "name" || activeInput === "leadTime")}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {zone?.boundaries.length > 0 && (
                <Polygon
                  positions={zone.boundaries}
                  pathOptions={{ color: zone.color, fillOpacity: 0.4 }}
                />
              )}
              <MapEvents setZone={setZone} />
            </MapContainer>
          </div>
          <button
            onClick={() => handleClearBoundaries(setZone)}
            className="mt-2 px-4 py-1.5 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Clear Boundaries
          </button>
          {formErrors.boundaries && (
            <p className="text-red-500 text-xs mt-1">{formErrors.boundaries}</p>
          )}
        </div>
      </div>
    );
  });

  // Add Zone Modal
  const AddZoneModal = () => (
    <ModalContainer
      title="Create New Zone"
      onClose={() => {
        setIsAddModalOpen(false);
        setFormErrors({});
        setNewZone({
          name: "",
          leadTime: "",
          backupZones: [],
          color: "#FF0000",
          boundaries: [],
        });
        setActiveInput(null);
      }}
      maxWidth="max-w-4xl"
    >
      <ZoneForm zone={newZone} setZone={setNewZone} formErrors={formErrors} />
      <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 mt-6">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setIsAddModalOpen(false);
              setFormErrors({});
              setNewZone({
                name: "",
                leadTime: "",
                backupZones: [],
                color: "#FF0000",
                boundaries: [],
              });
              setActiveInput(null);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAddZone}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </ModalContainer>
  );

  // Edit Zone Modal
  const EditZoneModal = () => (
    <ModalContainer
      title="Edit Zone"
      onClose={() => {
        setIsEditModalOpen(false);
        setEditZone(null);
        setFormErrors({});
        setActiveInput(null);
      }}
      maxWidth="max-w-4xl"
    >
      <ZoneForm
        zone={editZone}
        setZone={setEditZone}
        formErrors={formErrors}
        isEdit={true}
      />
      <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 mt-6">
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setIsEditModalOpen(false);
              setEditZone(null);
              setFormErrors({});
              setActiveInput(null);
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleEditZone}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </ModalContainer>
  );

  // Delete Zone Modal
  const DeleteZoneModal = () => (
    <ModalContainer
      title="Delete Zone"
      onClose={() => {
        setIsDeleteModalOpen(false);
        setDeleteZone(null);
      }}
      maxWidth="max-w-xl"
    >
      <p className="text-gray-700 text-sm mb-6">
        Are you sure you want to delete <strong>{deleteZone?.name}</strong>?
        This action cannot be undone.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={() => {
            setIsDeleteModalOpen(false);
            setDeleteZone(null);
          }}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteZone}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
        >
          Delete
        </button>
      </div>
    </ModalContainer>
  );

  // View All Zones Modal
  const ViewAllZonesModal = () => (
    <ModalContainer
      title="All Zones"
      onClose={() => setIsViewAllModalOpen(false)}
      maxWidth="max-w-5xl"
    >
      <div className="h-[80vh] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        <MapContainer
          center={[-1.2864, 36.8172]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          ref={viewAllMapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {zones
            .filter((zone) => zone.boundaries.length > 0)
            .map((zone) => (
              <Polygon
                key={zone.id}
                positions={zone.boundaries}
                pathOptions={{ color: zone.color, fillOpacity: 0.4 }}
              >
                <Popup>{zone.name}</Popup>
              </Polygon>
            ))}
        </MapContainer>
      </div>
      <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 mt-6">
        <div className="flex justify-end">
          <button
            onClick={() => setIsViewAllModalOpen(false)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </ModalContainer>
  );

  return (
    <>
      {isAddModalOpen && <AddZoneModal />}
      {isEditModalOpen && editZone && <EditZoneModal />}
      {isDeleteModalOpen && deleteZone && <DeleteZoneModal />}
      {isViewAllModalOpen && <ViewAllZonesModal />}
    </>
  );
};

export default ZoneModals;
