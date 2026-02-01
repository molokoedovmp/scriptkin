"use client";

import dynamic from "next/dynamic";
const AdminApp = dynamic(() => import("./ui/AdminApp"), { ssr: false });

export default function AdminPage() {
  return <AdminApp />;
}
