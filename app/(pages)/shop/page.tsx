// app/(pages)/shop/page.tsx
import Navbar from "@/components/Nabvar";
import ProductCard from "@/components/ProductCard";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import CategoryFilter from "./components/CategoryFilter";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

const ShopPage = async ({ searchParams }: ShopPageProps) => {
  const { category } = await searchParams;

  await connectDB();

  // Obtener todas las categorías
  const categories = await Category.find().sort({ name: 1 }).lean();

  // Crear un mapa de slug -> _id para búsqueda rápida
  const categoryMap = new Map(
    categories.map((cat) => [cat.slug, cat._id.toString()]),
  );

  // Construir query para productos
  const query: { inStock: boolean; category?: string } = { inStock: true };

  if (category && category !== "alla") {
    const categoryId = categoryMap.get(category);
    if (categoryId) {
      query.category = categoryId; // Filtrar por el ID de la categoría
    } else {
      query.category = "nonexistent"; // No mostrar productos si no existe
    }
  }

  const products = await Product.find(query).lean();

  return (
    <>
      <Navbar />
      <div className="min-h-screen max-w-6xl mx-auto p-4 py-12">
        <h1 className="text-6xl font-bold my-6">Produkter</h1>

        {/* Filtro de categorías */}
        {categories.length > 0 && (
          <CategoryFilter
            categories={categories.map((cat) => ({
              _id: cat._id.toString(),
              name: cat.name,
              slug: cat.slug,
            }))}
            currentCategory={category}
          />
        )}

        {products.length === 0 ? (
          <p className="text-center py-12 text-gray-500">
            {category
              ? "Inga produkter i denna kategori"
              : "Inga produkter tillgängliga"}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id.toString()}
                product={{
                  ...product,
                  _id: product._id.toString(),
                  createdAt: product.createdAt?.toString(),
                  updatedAt: product.updatedAt?.toString(),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ShopPage;
