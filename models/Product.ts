// models/Product.ts
import { Schema, model, models } from "mongoose";

export interface IProduct {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stripeId: string;
  images: string[];
  inStock: boolean;
  stock: number;
  category: string; // ID de la categoría
  rabatt: boolean; // Tiene descuento
  discountPercentage: number; // Porcentaje de descuento (0-100)
  createdAt?: Date;
  updatedAt?: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stripeId: { type: String, required: true, unique: true },
    images: [{ type: String }],
    inStock: { type: Boolean, default: true },
    stock: { type: Number, required: true, default: 0 },
    category: { type: String, required: true },
    rabatt: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true },
);

const Product = models.Product || model("Product", productSchema);
export default Product;
