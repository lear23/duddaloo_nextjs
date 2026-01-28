// models/Category.ts
import { Schema, model, models } from "mongoose";

export interface ICategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true },
);

const Category = models.Category || model("Category", categorySchema);
export default Category;
