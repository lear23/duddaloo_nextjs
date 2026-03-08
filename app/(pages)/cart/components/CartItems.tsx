import type { CartItem } from "../types";
import CartItemRow from "./CartItemRow";

type Props = {
  items: CartItem[];
  updatingItem: string | null;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  removeItem: (productId: string, size?: string) => void;
};

export default function CartItems({
  items,
  updatingItem,
  updateQuantity,
  removeItem,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {items.map((item) => (
        <CartItemRow
          key={`${item.productId}-${item.size || "no-size"}`}
          item={item}
          updatingItem={updatingItem}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />
      ))}
    </div>
  );
}
