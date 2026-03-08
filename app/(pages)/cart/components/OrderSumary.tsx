import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CartData } from "../types";

type Props = {
  cart: CartData;
  isRedirecting: boolean;
  handleCheckout: () => void;
};

export default function OrderSummary({
  cart,
  isRedirecting,
  handleCheckout,
}: Props) {
  const SHIPPING_THRESHOLD = 1000;
  const SHIPPING_COST = 69;

  const shippingCost =
    cart.totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const totalWithShipping = cart.totalPrice + shippingCost;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-8">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Ordersammanfattning
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Delsumma</span>
            <span>{cart.totalPrice} SEK</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Frakt</span>
            <span
              className={
                shippingCost === 0
                  ? "text-green-600 font-semibold"
                  : "text-gray-600"
              }
            >
              {shippingCost === 0 ? "GRATIS" : `${shippingCost} SEK`}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Skatter</span>
            <span>Ingår</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">Totalt</span>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {totalWithShipping} SEK
              </div>
              <p className="text-sm text-gray-500 mt-1">Inklusive moms</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Betalning sker i svenska kronor
          </p>

          <button
            onClick={handleCheckout}
            disabled={isRedirecting}
            className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg"
          >
            {isRedirecting ? "Behandlas..." : "Gå till betalning →"}
          </button>

          <Link
            href="/"
            className="mt-4 w-full text-center text-gray-600 hover:text-gray-900 py-3 rounded-xl inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Fortsätt handla
          </Link>
        </div>
      </div>
    </div>
  );
}
