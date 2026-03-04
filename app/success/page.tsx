"use client";
// app/success/page.tsx
import Link from "next/link";
import { useState, useEffect } from "react";
import SuccessModal from "@/components/SuccessModal";

export default function SuccessPage() {
  const [open, setOpen] = useState(true);

  // clear cart on success page visit
  useEffect(() => {
    const cartId = localStorage.getItem("cart_id");
    if (cartId) {
      fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId }),
      }).catch((err) => {
        console.error("Failed to clear cart on success page:", err);
      });
      localStorage.removeItem("cart_id");
    }
  }, []);

  return (
    <>
      <SuccessModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Betalning slutförd!"
        message="Tack för ditt köp. Vi arbetar på att packa din beställning."
        buttonText="Tillbaka till butiken"
        buttonHref="/"
      />
      {/* fallback content in case modal is closed or for accessibility */}
      {!open && (
        <div className="max-w-md mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-green-600">
            Betalning slutförd!
          </h1>
          <p>Tack för ditt köp.</p>
          <Link href="/" className="text-blue-600 mt-4 inline-block">
            Tillbaka till butiken
          </Link>
        </div>
      )}
    </>
  );
}
