// components/ErrorModal.tsx
"use client";

import Modal from "./Modal";

export default function ErrorModal({
  isOpen,
  onClose,
  title = "Fel",
  message = "Ett fel uppstod",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <p className="text-gray-600">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="block w-full bg-red-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Stäng
        </button>
      </div>
    </Modal>
  );
}
