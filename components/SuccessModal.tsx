// components/SuccessModal.tsx
"use client";

import Modal from "./Modal";
import Link from "next/link";

export default function SuccessModal({
  isOpen,
  onClose,
  title = "¡Éxito!",
  message = "Tu acción se completó correctamente",
  buttonText = "Continuar",
  buttonHref = "/",
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  buttonHref?: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="text-gray-600">{message}</p>
        </div>
        <Link
          href={buttonHref}
          onClick={onClose}
          className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
    </Modal>
  );
}
