// app/success/page.tsx
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-green-600">Betalning slutförd!</h1>
      <p>Tack för ditt köp.</p>
      <Link href="/" className="text-blue-600 mt-4 inline-block">Tillbaka till butiken</Link>
    </div>
  );
}
