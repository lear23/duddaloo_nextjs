// app/admin/actions/createCategory.ts
"use server";

import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function createCategory(prevState: any, formData: FormData) {
  try {
    await connectDB();

    const name = formData.get("name") as string;
    const slug =
      (formData.get("slug") as string) ||
      name.toLowerCase().replace(/\s+/g, "-");
    const description = formData.get("description") as string;
    const sizesInput = (formData.get("sizes") as string)?.trim() || "";
    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!name) {
      return {
        success: false,
        error: "Category name is required",
      };
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return {
        success: false,
        error: "Category already exists",
      };
    }

    const category = new Category({
      name,
      slug,
      description,
      sizes: sizes.length > 0 ? sizes : [],
    });

    await category.save();

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create category",
    };
  }
}
