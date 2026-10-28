import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = { title: "Yönetim paneli", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="container-x py-12"><div className="h-64 animate-pulse rounded-2xl bg-cream-200" /></div>}>
      <AdminPanel />
    </Suspense>
  );
}
