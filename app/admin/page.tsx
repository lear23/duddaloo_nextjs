import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";

import AdminContent from "./components/AdminContent";
import AdminProductList from "./components/AdminProductList";

export default async function AdminPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return <AdminContent productList={<AdminProductList />} />;
}
