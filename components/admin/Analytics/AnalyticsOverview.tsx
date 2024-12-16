'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, UserCheck } from "lucide-react";
import { StatCardProps, AnalyticsOverviewProps } from "./types";

const StatCard = ({ title, value, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function Overview({ data }: AnalyticsOverviewProps) {
  const { totalClients, totalMentors, totalEvents } = data;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Clients"
        value={totalClients}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Mentors"
        value={totalMentors}
        icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Total Events"
        value={totalEvents}
        icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}