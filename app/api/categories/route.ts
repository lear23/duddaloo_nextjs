// app/api/categories/route.ts
import connectDB from "@/lib/db";
import Category from "@/models/Category";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ createdAt: 1 });
    return Response.json(categories);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}
