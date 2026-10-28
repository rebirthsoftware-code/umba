import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: { absolute: "Umba Yönetim" },
  robots: { index: false, follow: false },
  manifest: "/yonetim.webmanifest",
  appleWebApp: { capable: true, title: "Umba Yönetim", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/admin-apple-180.png" },
};

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="container-x py-12"><div className="h-64 animate-pulse rounded-2xl bg-cream-200" /></div>}>
      <AdminPanel />
    </Suspense>
  );
}
