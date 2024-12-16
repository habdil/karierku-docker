import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, GraduationCap, Clock } from "lucide-react";

interface ClientListProps {
  clients: Array<{
    id: string;
    fullName: string;
    major: string | null;
    currentStatus: string | null;
    dreamJob: string | null;
    mentorshipStatus: 'NEW' | 'IN_PROGRESS' | 'COMPLETED';
    lastConsultation?: {
      id: string;
      status: string;
      createdAt: string;
    };
  }>;
}

export default function ClientList({ clients }: ClientListProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => (
        <Card key={client.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{client.fullName}</CardTitle>
                <CardDescription className="mt-1">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    {client.major || "No major specified"}
                  </div>
                </CardDescription>
              </div>
              <Badge className={getStatusColor(client.mentorshipStatus)}>
                {client.mentorshipStatus.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                {client.dreamJob && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    {client.dreamJob}
                  </div>
                )}
                {client.lastConsultation && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Last session: {new Date(client.lastConsultation.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => router.push(`/dashboard-mentor/clients/${client.id}`)}
                  className="w-full"
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}