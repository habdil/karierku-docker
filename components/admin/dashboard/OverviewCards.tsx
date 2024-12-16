// components/admin/dashboard/OverviewCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, MessageSquare, Brain } from "lucide-react";

interface OverviewCardsProps {
  analytics: {
    totalUsers: number;
    activeMentors: number;
    upcomingEvents: number;
    totalConsultations: number;
    totalCareerAssessments: number;
  };
}

export function OverviewCards({ analytics }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      description: "Active users on platform"
    },
    {
      title: "Active Mentors",
      value: analytics.activeMentors,
      icon: Users,
      description: "Currently active mentors"
    },
    {
      title: "Upcoming Events",
      value: analytics.upcomingEvents,
      icon: Calendar,
      description: "Events scheduled"
    },
    {
      title: "Total Consultations",
      value: analytics.totalConsultations,
      icon: MessageSquare,
      description: "Consultation sessions"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}