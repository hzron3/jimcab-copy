"use client";

const AddClientModal = ({
  isOpen,
  onRequestClose,
  formData,
  handleInputChange,
  handleAddClient,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md sm:max-w-lg rounded-xl bg-white shadow-2xl p-6 sm:p-8 mx-4 sm:mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Add New Client
        </h2>
        <form onSubmit={handleAddClient}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter client name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Staff Count
            </label>
            <input
              type="number"
              name="staff"
              value={formData.staff}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="Enter staff count"
              required
              min="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            >
              <option value="Corporate">Corporate</option>
              <option value="Travel Agency">Travel Agency</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onRequestClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              Add Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;
