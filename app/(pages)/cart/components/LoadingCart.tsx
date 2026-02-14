export default function LoadingCart() {
  return (
    <div className="min-h-screen flex items-center justify-center font-sans">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600">Loading your cart...</p>
      </div>
    </div>
  );
}
