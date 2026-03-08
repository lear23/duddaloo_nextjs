export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  stock?: number;
};

export type CartData = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};
