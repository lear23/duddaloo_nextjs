// app/cancel/page.tsx
export default function CancelPage() {
  return (
    <div className="max-w-md mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Betalning avbruten</h1>
      <p>Ingen avgift har gjorts.</p>
      <a href="/cart" className="text-blue-600 mt-4 inline-block">Tillbaka till varukorgen</a>
    </div>
  );
}
