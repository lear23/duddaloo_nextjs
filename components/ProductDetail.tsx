"use client";

import Image from "next/image";
import { useState } from "react";
import { ShoppingCart, ArrowLeft, CheckCircle2, X, Check, Leaf, Truck, RefreshCw, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartId } from "@/lib/cartUtils";
import ErrorModal from "./ErrorModal";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  inStock: boolean;
  stock?: number;
  sizes?: string[];
}

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter();
  const cartId = useCartId();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const addToCart = async () => {
    if (!cartId || !product.inStock) return;

    // Validera att en storlek har valts om det krävs
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setErrorMessage(
        "Vänligen välj en storlek innan du lägger till i varukorgen",
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          productId: product._id,
          quantity,
          size: selectedSize,
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event("cart-updated"));
        setShowSuccessModal(true);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Fel vid tillägg till varukorg");
      }
    } catch (error) {
      setErrorMessage("Nätverksfel vid tillägg till varukorg");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* CENTRERAD FRAMGÅNGSMODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Tillagt!</h3>
            <p className="text-gray-600 mb-8">
              {quantity}x {product.name} har lagts till i din varukorg.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/cart")}
                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-[0.98]"
              >
                Gå till varukorgen
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 text-gray-500 font-medium hover:text-gray-800 transition-colors"
              >
                Fortsätt handla
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Tillbaka till produkter</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
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
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                  <span className="text-gray-400">Ingen bild tillgänglig</span>
                </div>
              )}
            </div>

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
                      alt={`${product.name} vy ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="py-12 space-y-4 lg:space-y-8">
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

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Beskrivning
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {errorMessage && (
              <ErrorModal
                isOpen={!!errorMessage}
                onClose={() => setErrorMessage(null)}
                title="Lagervarning"
                message={errorMessage}
              />
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  📏 Välj storlek
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? "border-purple-600 bg-purple-50 text-purple-600"
                          : "border-gray-300 bg-white text-gray-700 hover:border-purple-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
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
                      if (typeof product.stock === "number") {
                        setQuantity(Math.min(quantity + 1, product.stock));
                      } else {
                        setQuantity(quantity + 1);
                      }
                    }}
                    disabled={
                      typeof product.stock === "number" &&
                      quantity >= product.stock
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                <div className="text-sm text-gray-500">
                  {product.inStock ? (
                    <>
                      <span className="text-green-600">✓ I lager</span>
                      {typeof product.stock === "number" && (
                        <span className="ml-2">({product.stock} kvar)</span>
                      )}
                    </>
                  ) : (
                    <span className="text-red-600">✗ Slut i lager</span>
                  )}
                </div>
              </div>

              {/* 🔥 SECCIÓN MEJORADA 1: Productspecifikationer med gröna ikoner */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Silk Premiumpapper</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Producerat i Sverige</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Åldringsbeständigt papper</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
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
                      <span>Lägger till i varukorg...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Lägg i varukorg</span>
                    </>
                  )}
                </button>
              </div>

              {/* 🔥 SECCIÓN MEJORADA 2: Leveransinformation med gröna ikoner */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Leverans 7-14 arbetsdagar</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-600">
                    <Truck className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Fri frakt över 1000kr</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-green-600">
                    <RefreshCw className="h-5 w-5" />
                  </div>
                  <p className="text-gray-700">Öppet köp i 14 dagar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}