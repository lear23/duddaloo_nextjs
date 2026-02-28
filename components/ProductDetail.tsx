// components/ProductDetail.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartId } from "@/lib/cartUtils";
import ErrorModal from "./ErrorModal";

interface ProductDetailProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    inStock: boolean;
    stock?: number;
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const cartId = useCartId();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const addToCart = async () => {
    if (!cartId || !product.inStock) return;
    
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          cartId, 
          productId: product._id, 
          quantity 
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("cart-updated"));
        alert(`✅ ${quantity} ${product.name} added to cart`);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Error adding to cart");
      }
    } catch (error) {
      setErrorMessage("Nätverksfel vid tilläggning till varukorg");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Botón de regreso */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to products</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div>
            {/* Imagen principal */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white mb-4">
              {product.images && product.images[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-lineart-to-br from-gray-100 to-gray-200">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === index
                        ? "border-purple-600 ring-2 ring-purple-200"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-covert"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="py-12 space-y-26 lg:space-y-36">
            {/* Nombre y precio */}
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-gray-900">
                {product.name}
              </h1>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900">
                  {product.price} SEK
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Cantidad y knappar */}
      {errorMessage && (
        <ErrorModal
          isOpen={!!errorMessage}
          onClose={() => setErrorMessage(null)}
          title="Lagervarning"
          message={errorMessage}
        />
      )}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-2 min-w-15 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (typeof product.stock === 'number') {
                        setQuantity(Math.min(quantity + 1, product.stock));
                      } else {
                        setQuantity(quantity + 1);
                      }
                    }}
                    disabled={typeof product.stock === 'number' && quantity >= product.stock}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  {product.inStock ? (
                    <>
                      <span className="text-green-600">✓ In stock</span>
                      {typeof product.stock === 'number' && (
                        <span className="ml-2">({product.stock} kvar)</span>
                      )}
                    </>
                  ) : (
                    <span className="text-red-600">✗ Out of stock</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addToCart}
                  disabled={!product.inStock || loading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all ${
                    product.inStock
                      ? "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg active:scale-[0.98]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } ${loading ? "opacity-70" : ""}`}
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding to cart...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}