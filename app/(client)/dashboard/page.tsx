import { getClientSession } from "@/lib/auth";
import ClientDashboard from "@/components/client/dashboard/Dashboard";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getClientSession();

  if (!session || session.role !== "CLIENT") {
    redirect("/login");
  }

  return <ClientDashboard clientName={session.fullName} />;
}