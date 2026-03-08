// app/admin/settings/page.tsx
// SECURITY FIX: Admin settings page for 2FA and security configuration

import { getAuthUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import TwoFactorSetup from "../components/TwoFactorSetup";
import TwoFactorStatus from "../components/TwoFactorStatus";
import AdminAsyde from "../components/AdminAsyde";

export default async function SettingsPage() {
  // SECURITY FIX: Verify user is authenticated
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

 return (
  <div className="container mx-auto min-h-screen bg-gray-50">
    <div className="flex w-full">
      <AdminAsyde />
      <main className="w-full p-6">
        <div className="mb-8 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-gray-900">
            Säkerhetsinställningar
          </h1>
          <p className="text-gray-600 mt-2">
            Hantera säkerhets- och autentiseringsinställningar för ditt konto
          </p>
        </div>

        <div className="space-y-8 max-w-6xl mx-auto w-full">
          {/* Säkerhetssektion: Tvåfaktorsautentisering */}
          <section className="max-w-4xl w-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Tvåfaktorsautentisering (2FA)
            </h2>
            <TwoFactorStatus />
            <div className="mt-6">
              <TwoFactorSetup />
            </div>
          </section>

          {/* Säkerhetssektion: Lösenordssäkerhet */}
          <section className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Lösenordssäkerhet
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Håll ditt lösenord starkt och unikt för att skydda ditt konto.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <p className="text-sm font-semibold text-blue-900">
                  ✓ Lösenordskrav:
                </p>
                <ul className="text-sm text-blue-900 space-y-1 ml-4 list-disc">
                  <li>Minst 8 tecken</li>
                  <li>Blanda versaler och gemener</li>
                  <li>Siffror och specialtecken</li>
                  <li>Undvik vanliga ord och personlig information</li>
                </ul>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Ändra lösenord
              </button>
            </div>
          </section>

          {/* Säkerhetssektion: Aktiva sessioner */}
          <section className="max-w-4xl w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Aktiva sessioner
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Din nuvarande session är aktiv. Sessioner upphör efter 24 timmar av inaktivitet av säkerhetsskäl.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Nuvarande enhet
                    </p>
                    <p className="text-sm text-gray-500">Aktiv nu</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                    Aktiv
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Säkerhetssektion: Säkerhetstips */}
          <section className="max-w-4xl w-full bg-amber-50 rounded-xl border border-amber-200 p-6">
            <h2 className="text-xl font-bold mb-4 text-amber-900">
              🛡️ Säkerhetstips
            </h2>
            <ul className="space-y-3 text-sm text-amber-900">
              <li>• ✅ Aktivera tvåfaktorsautentisering för maximal säkerhet</li>
              <li>• ✅ Använd ett unikt lösenord för ditt admin-konto</li>
              <li>• ✅ Spara säkerhetskopieringskoder på en säker plats</li>
              <li>• ✅ Logga ut från sessioner du inte känner igen</li>
              <li>• ✅ Dela aldrig dina TOTP-koder med någon</li>
              <li>• ✅ Se till att din autentiseringsapp är säkerhetskopierad</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  </div>
);

}
