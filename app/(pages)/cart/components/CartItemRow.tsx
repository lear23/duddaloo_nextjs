import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem } from '../types';

type Props = {
  item: CartItem;
  updatingItem: string | null;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
};

export default function CartItemRow({
  item,
  updatingItem,
  updateQuantity,
  removeItem,
}: Props) {
  return (
    <div className="p-4 md:p-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex gap-4 md:gap-6">
        {/* Imagen */}
        <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0">
          <div className="relative w-full h-full overflow-hidden rounded-xl border border-gray-200">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 112px"
            />
          </div>
        </div>

        {/* Contenido principal - Diferente en móvil y desktop */}
        <div className="flex-1">
          {/* MOBILE LAYOUT - visible solo en móvil */}
          <div className="md:hidden">
            {/* Primera línea: nombre y botón eliminar */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-base text-gray-900">
                {item.name}
              </h3>
              <button
                onClick={() => removeItem(item.productId)}
                disabled={updatingItem === item.productId}
                className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Segunda línea: precio unitario */}
            <p className="text-green-600 font-bold text-base mb-3">
              {item.price} SEK
            </p>
            
            {/* Tercera línea: controles de cantidad y total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  disabled={
                    updatingItem === item.productId || item.quantity <= 1
                  }
                  className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="min-w-10 text-center">
                  {updatingItem === item.productId ? (
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                  ) : (
                    <span className="font-semibold text-base px-2">
                      {item.quantity}
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  disabled={updatingItem === item.productId}
                  className="w-9 h-9 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
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
            
            {/* Línea de detalle (opcional) */}
            <p className="text-xs text-gray-500 mt-1">
              {item.quantity} × {item.price} SEK
            </p>
          </div>

          {/* DESKTOP LAYOUT - exactamente como estaba, visible solo en desktop */}
          <div className="hidden md:block">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {item.name}
                </h3>
                <p className="text-green-600 font-bold text-lg">
                  {item.price} SEK
                </p>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                disabled={updatingItem === item.productId}
                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                  disabled={
                    updatingItem === item.productId || item.quantity <= 1
                  }
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="min-w-15 text-center">
                  {updatingItem === item.productId ? (
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                  ) : (
                    <span className="font-semibold text-lg px-3 py-1">
                      {item.quantity}
                    </span>
                  )}
                </div>

                <button
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  disabled={updatingItem === item.productId}
                  className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
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