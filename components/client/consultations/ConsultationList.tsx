// components/client/consultations/ConsultationList.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Video } from 'lucide-react';
import { ConsultationDetails, MentorExpertise } from '@/lib/types/consultations';
import { Button } from '@/components/ui/button';

interface ConsultationListProps {
  consultations: ConsultationDetails[];
}

export default function ConsultationList({ consultations }: ConsultationListProps) {
  const router = useRouter();

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500 hover:bg-green-600';
      case 'PENDING':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'COMPLETED':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'CANCELLED':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatDateTime = (date: string | Date) => {
    const d = new Date(date);
    return {
      date: d.toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
      time: d.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {consultations.map((consultation) => (
        <Card 
          key={consultation.id}
          className="hover:shadow-lg transition-shadow"
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={consultation.mentor.image || undefined} />
              <AvatarFallback>
                {consultation.mentor.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{consultation.mentor.fullName}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {consultation.mentor.expertise.map((exp: MentorExpertise) => (
                  <Badge key={exp.id} variant="outline">
                    {exp.area}
                  </Badge>
                ))}
              </div>
            </div>
            <Badge className={getStatusBadgeVariant(consultation.status)}>
              {consultation.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultation.slot && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(consultation.slot.startTime).date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatDateTime(consultation.slot.startTime).time} - 
                    {formatDateTime(consultation.slot.endTime).time}
                  </span>
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              {consultation.status === 'ACTIVE' && consultation.zoomLink && (
                <Button 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(consultation.zoomLink as string, '_blank');
                  }}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/dashboard/consultation/consul/${consultation.id}`)}
              >
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}