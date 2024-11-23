// components/client/consultations/ListMentor.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Chat from './Chat';
import Zoom from './Zoom';
import { Briefcase, GraduationCap, Calendar } from 'lucide-react';
import { MentorResponse } from '@/lib/types/api';

interface MentorListProps {
  mentors: MentorResponse[];
  onChatClick: (mentorId: string) => void;
}

const ListMentor = ({ mentors, onChatClick }: MentorListProps) => {
  const router = useRouter();

  const handleCardClick = (mentorId: string) => {
    router.push(`/dashboard/consultation/${mentorId}`);
  };

  const handleButtonClick = (
    e: React.MouseEvent,
    callback: () => void
  ) => {
    e.stopPropagation(); 
    callback();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {mentors.map((mentor) => (
        <Card 
          key={mentor.id} 
          className="flex flex-col cursor-pointer transition-all hover:shadow-lg"
          onClick={() => handleCardClick(mentor.id)}
        >
          <CardHeader className="flex-row gap-4 items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mentor.image || undefined} alt={mentor.fullName} />
              <AvatarFallback>
                {mentor.fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold text-lg">{mentor.fullName}</h3>
              <Badge 
                variant={mentor.status === 'ACTIVE' ? 'success' : 'error'}
                className="w-fit"
              >
                {mentor.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span>{mentor.jobRole} at {mentor.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>{mentor.education}</span>
              </div>
              {mentor.hasAvailableSlot && mentor.nextAvailableSlot && (
                <div className="flex items-center gap-2 text-green-600">
                  <Calendar className="h-4 w-4" />
                  <span>Next available: {
                    new Date(mentor.nextAvailableSlot).toLocaleDateString()
                  }</span>
                </div>
              )}
              <div className="flex flex-wrap gap-1 mt-2">
                {mentor.expertise.map((exp) => (
                  <Badge
                    key={exp.area}
                    variant="outline"
                    className="text-xs"
                  >
                    {exp.area}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Chat 
              onClick={(e) => handleButtonClick(e, () => onChatClick(mentor.id))} 
            />
            {mentor.consultation?.zoomLink && (
              <Zoom 
                link={mentor.consultation.zoomLink}
                onClick={(e) => handleButtonClick(e, () => {})}
              />
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ListMentor;