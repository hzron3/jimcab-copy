import React from "react";
import { UserIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

const AddUserModal = ({
  isOpen,
  onClose,
  onSave,
  newUser,
  setNewUser,
  formErrors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Add New User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Username *
            </label>
            <input
              type="text"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Username"
              required
            />
            {formErrors.username && (
              <p className="text-xs text-red-600 mt-1">{formErrors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Email *
            </label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Email"
              required
            />
            {formErrors.email && (
              <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Mobile Number *
            </label>
            <input
              type="text"
              value={newUser.mobileNumber}
              onChange={(e) =>
                setNewUser({ ...newUser, mobileNumber: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Mobile Number"
              required
            />
            {formErrors.mobileNumber && (
              <p className="text-xs text-red-600 mt-1">
                {formErrors.mobileNumber}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Role"
            >
              <option value="SUPERADMIN">Admin</option>
              <option value="DISPATCH">Dispatch</option>
              <option value="ACCOUNTS">Accounts</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Status
            </label>
            <select
              value={newUser.status}
              onChange={(e) =>
                setNewUser({ ...newUser, status: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Status"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
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
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
              aria-label="Save user"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditUserModal = ({
  isOpen,
  onClose,
  onSave,
  editUser,
  setEditUser,
  formErrors,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Edit User</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Username *
            </label>
            <input
              type="text"
              value={editUser.username}
              onChange={(e) =>
                setEditUser({ ...editUser, username: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Username"
              required
            />
            {formErrors.username && (
              <p className="text-xs text-red-600 mt-1">{formErrors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Email *
            </label>
            <input
              type="email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Email"
              required
            />
            {formErrors.email && (
              <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Mobile Number *
            </label>
            <input
              type="text"
              value={editUser.mobileNumber}
              onChange={(e) =>
                setEditUser({ ...editUser, mobileNumber: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Mobile Number"
              required
            />
            {formErrors.mobileNumber && (
              <p className="text-xs text-red-600 mt-1">
                {formErrors.mobileNumber}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              value={editUser.role}
              onChange={(e) =>
                setEditUser({ ...editUser, role: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Role"
            >
              <option value="SUPERADMIN">Admin</option>
              <option value="DISPATCH">Dispatch</option>
              <option value="ACCOUNTS">Accounts</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Status
            </label>
            <select
              value={editUser.status}
              onChange={(e) =>
                setEditUser({ ...editUser, status: e.target.value })
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Status"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
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
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
              aria-label="Save user"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteUserModal = ({ isOpen, onClose, onDelete, user }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-medium text-gray-700 mb-4">Delete User</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete user{" "}
          <span className="font-medium">{user?.username}</span>? This action
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
            aria-label="Delete user"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export { AddUserModal, EditUserModal, DeleteUserModal };
