// components/client/consultations/MentorCard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CalendarDays, MessageSquare } from "lucide-react";
import Link from "next/link";

interface MentorCardProps {
  id: string;
  name: string;
  avatar?: string;
  company: string;
  jobRole: string;
  education: string;
  isAvailableNow?: boolean;
}

export function MentorCard({
  id,
  name,
  avatar,
  company,
  jobRole,
  education,
  isAvailableNow = false,
}: MentorCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{name}</h3>
            {isAvailableNow && (
              <Badge variant="success" className="bg-green-500">
                Available Now
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{jobRole} at {company}</p>
          <p className="text-sm text-muted-foreground">{education}</p>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/consultation/${id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link href={`/dashboard/consultation/${id}/book`}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Book Session
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}