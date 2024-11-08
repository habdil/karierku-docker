// components/client/consultations/ConsultationDetails.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, Video } from "lucide-react";

interface ConsultationDetailsProps {
  mentorName: string;
  date: Date;
  zoomLink?: string;
  status: "scheduled" | "in-progress" | "completed";
}

export function ConsultationDetails({
  mentorName,
  date,
  zoomLink,
  status
}: ConsultationDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Consultation Details</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Mentor</p>
          <p className="font-medium">{mentorName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Schedule</p>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <p>{date.toLocaleString()}</p>
          </div>
        </div>
        {zoomLink && (
          <div>
            <p className="text-sm text-muted-foreground">Meeting Link</p>
            <Button variant="outline" className="w-full" asChild>
              <a href={zoomLink} target="_blank" rel="noopener noreferrer">
                <Video className="mr-2 h-4 w-4" />
                Join Zoom Meeting
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}