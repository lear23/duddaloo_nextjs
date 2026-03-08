"use server";

import connectDB from "@/lib/db";
import Category from "@/models/Category";
import { requireAuthAction } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCategory(
  prevState: { success: boolean; error: string | null },
  formData: FormData,
) {
  try {
    // SECURITY FIX: Verify user is authenticated before allowing category updates
    await requireAuthAction();

    await connectDB();

    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const sizesInput = (formData.get("sizes") as string)?.trim() || "";
    const sizes = sizesInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (!id || !name) {
      return {
        success: false,
        error: "Category ID and name are required",
      };
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        description,
        sizes: sizes.length > 0 ? sizes : [],
      },
      { new: true },
    );

    if (!updatedCategory) {
      return {
        success: false,
        error: "Category not found",
      };
    }

    revalidatePath("/admin/categories");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update category",
    };
  }
}
