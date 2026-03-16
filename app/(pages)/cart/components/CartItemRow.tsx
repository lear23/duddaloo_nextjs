import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import type { CartItem } from "../types";

type Props = {
  item: CartItem;
  updatingItem: string | null;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
};

export default function CartItemRow({
  item,
  updatingItem,
  updateQuantity,
  removeItem,
}: Props) {
  const itemKey = `${item.productId}-${item.size || "no-size"}`;

  // 🛠️ CONFIGURACIÓN REAL DE SUPABASE (CON TUS DATOS)
  const projectId = "sszyfwfazrxewdarezbn";
  const bucket = "uploads"; 

  // Limpiamos la ruta para evitar el error 400 y barras dobles
  const cleanImagePath = item.image.replace(/^\/?uploads\//, "");
  
  const imageUrl = item.image.startsWith('http') 
    ? item.image 
    : `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${cleanImagePath}`;

  return (
    <div className="p-4 md:p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4 md:gap-6">
        {/* Bild */}
        <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0">
          <div className="relative w-full h-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
            <Image
              src={imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 112px"
              priority
              unoptimized={true} // Esto evita que Vercel intente procesar la imagen y falle con 400
            />
          </div>
        </div>

        <div className="flex-1">
          {/* MOBILE LAYOUT */}
          <div className="md:hidden">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-base text-gray-900 leading-tight">
                {item.name}
              </h3>
              <button
                onClick={() => removeItem(item.productId, item.size)}
                disabled={updatingItem === itemKey}
                className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {item.size && (
              <p className="text-xs text-gray-500 mb-2">
                📏 Storlek: {item.size}
              </p>
            )}

            <p className="text-green-600 font-bold text-base mb-3">
              {item.price} SEK
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                  disabled={updatingItem === itemKey || item.quantity <= 1}
                  className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="min-w-10 text-center">
                  {updatingItem === itemKey ? (
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                  ) : (
                    <span className="font-semibold text-base px-2">
                      {item.quantity}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                  disabled={updatingItem === itemKey || (typeof item.stock === 'number' && item.quantity >= item.stock)}
                  className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="text-base font-bold text-gray-900">
                  {item.quantity * item.price} SEK
                </p>
              </div>
            </div>
          </div>

          {/* DESKTOP LAYOUT */}
          <div className="hidden md:block">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {item.name}
                </h3>
                {item.size && (
                  <p className="text-sm text-gray-500 mb-2">
                    📏 Storlek: {item.size}
                  </p>
                )}
                <p className="text-green-600 font-bold text-lg">
                  {item.price} SEK
                </p>
              </div>

              <button
                onClick={() => removeItem(item.productId, item.size)}
                disabled={updatingItem === itemKey}
                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                  disabled={updatingItem === itemKey || item.quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="min-w-15 text-center">
                  {updatingItem === itemKey ? (
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                  ) : (
                    <span className="font-semibold text-lg px-3 py-1">
                      {item.quantity}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                  disabled={updatingItem === itemKey || (typeof item.stock === 'number' && item.quantity >= item.stock)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">
                  {item.quantity * item.price} SEK
                </p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × {item.price} SEK
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}