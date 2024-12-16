// components/client/consultations/ConsultationList.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MessageCircle } from 'lucide-react';
import { ConsultationDetails } from '@/lib/types/consultations';

interface ConsultationListProps {
  consultations: ConsultationDetails[];
}

export default function ConsultationList({ consultations }: ConsultationListProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500';
      case 'PENDING': return 'bg-yellow-500';
      case 'COMPLETED': return 'bg-blue-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {consultations.map((consultation) => (
        <Card 
          key={consultation.id}
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push(`/dashboard/consultation/${consultation.id}`)}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={consultation.mentor.image} />
              <AvatarFallback>
                {consultation.mentor.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{consultation.mentor.fullName}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {consultation.mentor.expertise.map((exp: { area: boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<React.AwaitedReactNode> | React.Key | null | undefined; }) => (
                  <Badge key={String(exp.area)} variant="outline">
                    {exp.area}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge 
              className={getStatusColor(consultation.status)}
            >
              {consultation.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {consultation.startTime && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(consultation.startTime).toLocaleDateString()}
                  </span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>
                    {new Date(consultation.startTime).toLocaleTimeString()}
                  </span>
                </div>
              )}
              {consultation.lastMessageAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageCircle className="h-4 w-4" />
                  <span>Last message: {
                    new Date(consultation.lastMessageAt).toLocaleString()
                  }</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}