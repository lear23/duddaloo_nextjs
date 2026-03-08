// app/shop/[id]/page.tsx
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/ProductDetail";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { notFound } from "next/navigation";

async function getProduct(id: string) {
  console.log("🔍 Söker produkt med ID:", id);

  try {
    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      console.log("❌ Produkt INTE funnen");
      return null;
    }

    // Obtener los tamaños de la categoría
    let categoryData = null;
    if (product.category) {
      categoryData = await Category.findById(product.category).lean();
    }

    console.log("✅ Produkt FUNNEN:", product.name);

    return {
      ...product,
      _id: product._id.toString(),
      createdAt: product.createdAt?.toString(),
      updatedAt: product.updatedAt?.toString(),
      sizes: categoryData?.sizes || [],
    };
  } catch (error) {
    console.error("💥 Fel i getProduct:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("📱 generateMetadata - ID:", id);

  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Produkt hittades inte - Duddaloo",
    };
  }

  return {
    title: `${product.name} - Duddaloo`,
    description: product.description || "Vacker produkt för barn",
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  console.log("🚀 ProductPage körs");

  const { id } = await params;
  console.log("📋 Mottaget ID:", id);

  const product = await getProduct(id);

  if (!product) {
    console.log("📛 Visar 404-sida");
    notFound();
  }

  console.log("🎉 Renderar ProductDetail med:", product.name);

  return (
    <>
      <Navbar />
      <ProductDetail product={product} />
    </>
  );
}
