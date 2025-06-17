"use client";

import React from "react";

const AddVehicleModal = ({
  isOpen,
  onClose,
  newVehicle,
  setNewVehicle,
  onSave,
  formErrors,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewVehicle((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 sm:mx-0 transform transition-all duration-300 scale-100 opacity-100 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Add New Vehicle
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="registration"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Registration
              </label>
              <input
                type="text"
                id="registration"
                name="registration"
                value={newVehicle.registration}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.registration ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.registration}
                aria-describedby={
                  formErrors.registration ? "registration-error" : undefined
                }
              />
              {formErrors.registration && (
                <p
                  id="registration-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {formErrors.registration}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="fleetNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Fleet Number
              </label>
              <input
                type="text"
                id="fleetNumber"
                name="fleetNumber"
                value={newVehicle.fleetNumber}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.fleetNumber ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.fleetNumber}
                aria-describedby={
                  formErrors.fleetNumber ? "fleetNumber-error" : undefined
                }
              />
              {formErrors.fleetNumber && (
                <p id="fleetNumber-error" className="mt-1 text-sm text-red-600">
                  {formErrors.fleetNumber}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="attribution"
                className="block text-sm font-medium text-gray-700"
              >
                Attribution
              </label>
              <input
                type="text"
                id="attribution"
                name="attribution"
                value={newVehicle.attribution}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={newVehicle.model}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.model ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.model}
                aria-describedby={formErrors.model ? "model-error" : undefined}
              />
              {formErrors.model && (
                <p id="model-error" className="mt-1 text-sm text-red-600">
                  {formErrors.model}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="make"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Make
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={newVehicle.make}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.make ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.make}
                aria-describedby={formErrors.make ? "make-error" : undefined}
              />
              {formErrors.make && (
                <p id="make-error" className="mt-1 text-sm text-red-600">
                  {formErrors.make}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={newVehicle.capacity}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.capacity ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.capacity}
                aria-describedby={
                  formErrors.capacity ? "capacity-error" : undefined
                }
              />
              {formErrors.capacity && (
                <p id="capacity-error" className="mt-1 text-sm text-red-600">
                  {formErrors.capacity}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="activationCode"
                className="block text-sm font-medium text-gray-700"
              >
                Activation Code
              </label>
              <input
                type="text"
                id="activationCode"
                name="activationCode"
                value={newVehicle.activationCode}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.activationCode
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.activationCode}
                aria-describedby={
                  formErrors.activationCode ? "activationCode-error" : undefined
                }
              />
              {formErrors.activationCode && (
                <p
                  id="activationCode-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {formErrors.activationCode}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={newVehicle.status}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditVehicleModal = ({
  isOpen,
  onClose,
  editVehicle,
  setEditVehicle,
  onSave,
  formErrors,
}) => {
  if (!isOpen || !editVehicle) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditVehicle((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 sm:mx-0 transform transition-all duration-300 scale-100 opacity-100 p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Edit Vehicle
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="registration"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Registration
              </label>
              <input
                type="text"
                id="registration"
                name="registration"
                value={editVehicle.registration}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.registration ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.registration}
                aria-describedby={
                  formErrors.registration ? "registration-error" : undefined
                }
              />
              {formErrors.registration && (
                <p
                  id="registration-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {formErrors.registration}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="fleetNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Fleet Number
              </label>
              <input
                type="text"
                id="fleetNumber"
                name="fleetNumber"
                value={editVehicle.fleetNumber}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.fleetNumber ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.fleetNumber}
                aria-describedby={
                  formErrors.fleetNumber ? "fleetNumber-error" : undefined
                }
              />
              {formErrors.fleetNumber && (
                <p id="fleetNumber-error" className="mt-1 text-sm text-red-600">
                  {formErrors.fleetNumber}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="attribution"
                className="block text-sm font-medium text-gray-700"
              >
                Attribution
              </label>
              <input
                type="text"
                id="attribution"
                name="attribution"
                value={editVehicle.attribution}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Model
              </label>
              <input
                type="text"
                id="model"
                name="model"
                value={editVehicle.model}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.model ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.model}
                aria-describedby={formErrors.model ? "model-error" : undefined}
              />
              {formErrors.model && (
                <p id="model-error" className="mt-1 text-sm text-red-600">
                  {formErrors.model}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="make"
                className="block text-sm font-medium text-gray-700"
              >
                Vehicle Make
              </label>
              <input
                type="text"
                id="make"
                name="make"
                value={editVehicle.make}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.make ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.make}
                aria-describedby={formErrors.make ? "make-error" : undefined}
              />
              {formErrors.make && (
                <p id="make-error" className="mt-1 text-sm text-red-600">
                  {formErrors.make}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700"
              >
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={editVehicle.capacity}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.capacity ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.capacity}
                aria-describedby={
                  formErrors.capacity ? "capacity-error" : undefined
                }
              />

              {formErrors.capacity && (
                <p id="capacity-error" className="mt-1 text-sm text-red-600">
                  {formErrors.capacity}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="activationCode"
                className="block text-sm font-medium text-gray-700"
              >
                Activation Code
              </label>
              <input
                type="text"
                id="activationCode"
                name="activationCode"
                value={editVehicle.activationCode}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border ${
                  formErrors.activationCode
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base`}
                aria-invalid={!!formErrors.activationCode}
                aria-describedby={
                  formErrors.activationCode ? "activationCode-error" : undefined
                }
              />
              {formErrors.activationCode && (
                <p
                  id="activationCode-error"
                  className="mt-1 text-sm text-red-600"
                >
                  {formErrors.activationCode}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={editVehicle.status}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm sm:text-base"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition duration-300 ease-in-out"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteVehicleModal = ({ isOpen, onClose, vehicle, onDelete }) => {
  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 sm:mx-0 transform transition-all duration-300 scale-100 opacity-100 p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Delete Vehicle
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          Are you sure you want to delete the vehicle with registration{" "}
          <span className="font-semibold text-gray-800">
            {vehicle.registration}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onDelete}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition duration-300 ease-in-out"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export { AddVehicleModal, EditVehicleModal, DeleteVehicleModal };
