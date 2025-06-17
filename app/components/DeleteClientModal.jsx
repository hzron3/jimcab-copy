"use client";

const DeleteClientModal = ({
  isOpen,
  onRequestClose,
  selectedClient,
  handleDeleteClient,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-sm bg-black/30"
      onClick={onRequestClose}
      role="dialog"
      aria-labelledby="delete-client-modal-title"
      onKeyDown={(e) => e.key === "Escape" && onRequestClose()}
      tabIndex={-1}
    >
      <div
        className="w-full max-w-md sm:max-w-lg rounded-xl bg-white shadow-2xl p-6 sm:p-8 mx-4 sm:mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-client-modal-title"
          className="text-xl font-semibold text-gray-900 mb-4"
        >
          Confirm Deletion
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium">{selectedClient?.name}</span>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteClient}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteClientModal;
