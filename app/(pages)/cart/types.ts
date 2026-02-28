export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
};

export type CartData = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};
