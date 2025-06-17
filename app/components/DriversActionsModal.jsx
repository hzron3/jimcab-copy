import React from "react";
import { UserIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const AddDriverModal = ({
  isOpen,
  onClose,
  onSave,
  newDriver,
  setNewDriver,
  formErrors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Add New Driver
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Driver Name *
            </label>
            <input
              type="text"
              value={newDriver.driverName}
              onChange={(e) =>
                setNewDriver({ ...newDriver, driverName: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Driver Name"
              required
            />
            {formErrors.driverName && (
              <p className="text-xs text-red-600 mt-1">
                {formErrors.driverName}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Driver Number *
            </label>
            <input
              type="text"
              value={newDriver.driverNumber}
              onChange={(e) =>
                setNewDriver({ ...newDriver, driverNumber: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Driver Number"
              required
            />
            {formErrors.driverNumber && (
              <p className="text-xs text-red-600 mt-1">
                {formErrors.driverNumber}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Badge Number
            </label>
            <input
              type="text"
              value={newDriver.badgeNumber}
              onChange={(e) =>
                setNewDriver({ ...newDriver, badgeNumber: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Badge Number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Status
            </label>
            <select
              value={newDriver.status}
              onChange={(e) =>
                setNewDriver({ ...newDriver, status: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Status"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Current Vehicle
            </label>
            <input
              type="text"
              value={newDriver.currentVehicle}
              onChange={(e) =>
                setNewDriver({ ...newDriver, currentVehicle: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Current Vehicle"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              License Expires *
            </label>
            <input
              type="date"
              value={newDriver.licenseExpires}
              onChange={(e) =>
                setNewDriver({ ...newDriver, licenseExpires: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="License Expires"
              required
            />
            {formErrors.licenseExpires && (
              <p className="text-xs text-red-600 mt-1">
                {formErrors.licenseExpires}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Insurance Expires
            </label>
            <input
              type="date"
              value={newDriver.insuranceExpires}
              onChange={(e) =>
                setNewDriver({ ...newDriver, insuranceExpires: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Insurance Expires"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out"
              aria-label="Save driver"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditDriverModal = ({
  isOpen,
  onClose,
  onSave,
  editDriver,
  setEditDriver,
  formErrors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Edit Driver</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Driver Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={editDriver.driverName}
              onChange={(e) =>
                setEditDriver({ ...editDriver, driverName: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Driver Name"
              required
            />
            {formErrors.driverName && (
              <p className="text-xs text-red-600 mt-1">
                {formErrors.driverName}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Driver Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={editDriver.driverNumber}
              onChange={(e) =>
                setEditDriver({ ...editDriver, driverNumber: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Driver Number"
              required
            />
            {formErrors.driverNumber && (
              <p className="text-xs text-red-600 mt-1">
                {formErrors.driverNumber}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Badge Number
            </label>
            <input
              type="text"
              value={editDriver.badgeNumber}
              onChange={(e) =>
                setEditDriver({ ...editDriver, badgeNumber: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Badge Number"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Status
            </label>
            <select
              value={editDriver.status}
              onChange={(e) =>
                setEditDriver({ ...editDriver, status: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Status"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Current Vehicle
            </label>
            <input
              type="text"
              value={editDriver.currentVehicle}
              onChange={(e) =>
                setEditDriver({ ...editDriver, currentVehicle: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Current Vehicle"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              License Expires <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={editDriver.licenseExpires}
              onChange={(e) =>
                setEditDriver({ ...editDriver, licenseExpires: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="License Expires"
              required
            />
            {formErrors.licenseExpires && (
              <p className="text-xs text-red-600 mt-1">
                {formErrors.licenseExpires}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Insurance Expires
            </label>
            <input
              type="date"
              value={editDriver.insuranceExpires}
              onChange={(e) =>
                setEditDriver({
                  ...editDriver,
                  insuranceExpires: e.target.value,
                })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              aria-label="Insurance Expires"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out"
              aria-label="Save driver"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteDriverModal = ({ isOpen, onClose, onDelete, driver }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg border border-gray-200">
        <h2 className="text-lg font-medium text-gray-700 mb-4">
          Delete Driver
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete driver{" "}
          <span className="font-medium">{driver?.driverName}</span>? This action
          cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out"
            aria-label="Cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 ease-in-out"
            aria-label="Delete driver"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export { AddDriverModal, EditDriverModal, DeleteDriverModal };
