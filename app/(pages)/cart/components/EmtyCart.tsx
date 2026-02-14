import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function EmptyCart() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto p-4 md:p-8 font-sans">
      <div className="text-center pt-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven&apos;t added any products to your cart yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
