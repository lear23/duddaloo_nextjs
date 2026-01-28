// app/admin/actions/deleteCategory.ts
"use server";

import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function deleteCategory(categoryId: string) {
  try {
    await connectDB();

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return {
        success: false,
        error: "Category not found",
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}
