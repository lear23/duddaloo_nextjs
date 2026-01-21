import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

import AdminAsyde from './components/AdminAsyde';
import AdminProductList from './components/AdminProductList';
import InactivityLogout from './components/InactivityLogout';
import LogoutButton from './components/LogoutButton';

export default async function AdminPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
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
                <h2 className="text-2xl font-bold text-gray-800">
                  Product Management
                </h2>
                <p className="text-gray-600">
                  View and manage all products
                </p>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                >
                  Back to Home
                </Link>

                <div className="w-48">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <AdminProductList />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[linear-gradient(90deg,#f5f3ff,#ede9fe)] rounded-xl p-4 border border-purple-100">
               <h4 className="font-semibold text-gray-800 mb-2">Tips</h4>
               <p className="text-sm text-gray-600">Add clear product images and detailed descriptions for better conversion.</p>
             </div>
             <div className="bg-[linear-gradient(90deg,#fffbeb,#fef3c7)] rounded-xl p-4 border border-yellow-100">
               <h4 className="font-semibold text-gray-800 mb-2">Reminder</h4>
               <p className="text-sm text-gray-600">Update stock status regularly to avoid overselling.</p>
             </div>
           </div>
        </main>
      </div>
    </div>
  );
}

