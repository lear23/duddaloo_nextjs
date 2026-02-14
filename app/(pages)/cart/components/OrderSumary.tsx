import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { CartData } from '../types';

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
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 sticky top-8">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Order Summary
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{cart.totalPrice} SEK</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxes</span>
            <span>Included</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">
              Total
            </span>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">
                {cart.totalPrice} SEK
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Including VAT
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            You&apos;ll pay in Swedish Krona
          </p>

          <button
            onClick={handleCheckout}
            disabled={isRedirecting}
            className="w-full bg-linear-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg"
          >
            {isRedirecting ? 'Processing...' : 'Proceed to Payment →'}
          </button>

          <Link
            href="/"
            className="mt-4 w-full text-center text-gray-600 hover:text-gray-900 py-3 rounded-xl inline-flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
