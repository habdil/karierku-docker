// app/(admin)/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { verifyToken } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Admin Dashboard - KarierKu",
  description: "Dashboard admin untuk mengelola platform KarierKu",
};

async function getSession() {
  const token = cookies().get("admin-token")?.value;
  
  if (!token) {
    return null;
  }
  try {
    const session = await verifyToken(token);
    return session;
  } catch (error) {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="h-screen flex bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={session} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}