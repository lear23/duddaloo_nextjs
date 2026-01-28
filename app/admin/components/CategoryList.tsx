// app/admin/components/CategoryList.tsx
import connectDB from "@/lib/db";
import Category from "@/models/Category";
import DeleteCategoryButton from "./DeleteCategoryButton";

export default async function CategoryList() {
  await connectDB();
  const categories = await Category.find({}).sort({ createdAt: -1 }).lean();

  if (categories.length === 0) {
    return <p className="text-gray-600">No categories yet.</p>;
  }

  return (
    <div className="space-y-2">
      {(categories as any[]).map((category) => (
        <div
          key={category._id.toString()}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
        >
          <div>
            <p className="font-semibold">{category.name}</p>
            <p className="text-sm text-gray-600">{category.slug}</p>
          </div>
          <DeleteCategoryButton categoryId={category._id.toString()} />
        </div>
      ))}
    </div>
  );
}
