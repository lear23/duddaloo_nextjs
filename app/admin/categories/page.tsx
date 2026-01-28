// app/admin/categories/page.tsx
import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminAsyde from "../components/AdminAsyde";
import CreateCategoryForm from "../components/CreateCategoryForm";
import CategoryList from "../components/CategoryList";
import InactivityLogout from "../components/InactivityLogout";
import LogoutButton from "../components/LogoutButton";

export default async function CategoriesPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InactivityLogout timeoutMinutes={60} />

      <div className="flex">
        <AdminAsyde />

        <main className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
                <p className="text-gray-600">Manage product categories</p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors shadow-lg"
                >
                  Back to Products
                </Link>

                <div className="w-48">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Category */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Create Category</h3>
                <CreateCategoryForm />
              </div>
            </div>

            {/* Categories List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">All Categories</h3>
                <CategoryList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
