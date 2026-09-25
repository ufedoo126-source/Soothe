"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import AdminCategories from "@/components/AdminCategories";
import AdminServicesManager from "@/components/AdminServicesManager";
import AdminBookings from "@/components/AdminBookings";

const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim());

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("categories");

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
        return;
      }
      setUser(session.user);
      setChecking(false);
    }
    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/admin/login");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (checking) {
    return (
      <main className="bg-ivory min-h-screen flex items-center justify-center">
        <p className="text-charcoal/50">Loading...</p>
      </main>
    );
  }

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <main className="bg-ivory min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-charcoal/70 mb-4">
            You're logged in, but this account doesn't have admin access.
          </p>
          <button onClick={handleLogout} className="text-rose underline">
            Log out
          </button>
        </div>
      </main>
    );
  }

  const TABS = [
    { id: "categories", label: "Categories" },
    { id: "services", label: "Services" },
    { id: "bookings", label: "Bookings" },
  ];

  return (
    <main className="bg-ivory min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-script text-3xl text-charcoal">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-charcoal/60 hover:text-rose underline"
          >
            Log out
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-nude">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                tab === t.id
                  ? "border-rose text-rose"
                  : "border-transparent text-charcoal/60"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "categories" && <AdminCategories />}
        {tab === "services" && <AdminServicesManager />}
        {tab === "bookings" && <AdminBookings />}
      </div>
    </main>
  );
}