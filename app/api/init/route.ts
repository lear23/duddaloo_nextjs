// app/api/init/route.ts
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();

    // Verificar si ya existe la categoría "posters"
    const existingCategory = await Category.findOne({ slug: "posters" });

    if (!existingCategory) {
      const postersCategory = new Category({
        name: "Posters",
        slug: "posters",
        description: "Beautiful posters for kids and families",
      });

      await postersCategory.save();

      return Response.json({
        success: true,
        message: "Posters category created",
        category: postersCategory,
      });
    }

    return Response.json({
      success: true,
      message: "Posters category already exists",
      category: existingCategory,
    });
  } catch (error) {
    console.error("Init error:", error);
    return Response.json(
      { error: "Failed to initialize", details: error },
      { status: 500 },
    );
  }
}
