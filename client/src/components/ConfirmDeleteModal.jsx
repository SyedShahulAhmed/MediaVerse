import { X, AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title = "Delete Entry" }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1f] text-white rounded-2xl p-6 w-[90%] max-w-sm relative 
                   shadow-[0_0_25px_rgba(239,68,68,0.3)] animate-fadeIn border border-red-800/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-red-400 transition"
        >
          <X size={20} />
        </button>

        {/* ⚠️ Icon + Title */}
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="text-red-400 mb-3" size={42} />
          <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-sm mb-6">
            This action cannot be undone. Are you sure you want to delete this entry?
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl font-medium text-white 
                       bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 
                       hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] transition-all active:scale-[0.97]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
