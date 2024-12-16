// components/admin/dashboard/RecentActivitiesList.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export interface RecentActivity {
  id: string;
  type: "user" | "consultation" | "event";
  title: string;
  description: string;
  timestamp: Date;
  avatar?: string;
}

interface RecentActivitiesListProps {
  activities: RecentActivity[];
}

export function RecentActivitiesList({ activities }: RecentActivitiesListProps) {
  return (
    <div className="space-y-8 max-h-[400px] overflow-auto custom-scrollbar">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatar} alt={activity.title} />
            <AvatarFallback>
              {activity.title.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  );
}