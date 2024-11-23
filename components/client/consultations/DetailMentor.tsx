// components/client/consultations/DetailMentor.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  ArrowLeft,
  MessageCircle,
  Video,
} from 'lucide-react';
import { MentorResponse } from '@/lib/types/api';
import Chat from './Chat';
import Zoom from './Zoom';

interface ConsultationSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
}

interface DetailMentorProps {
    mentor: MentorResponse;
    availableSlots?: ConsultationSlot[];
    onBookSlot?: (slotId: string) => void;
    onChatClick?: () => void;
}

const DetailMentor = ({ 
    mentor, 
    availableSlots = [], 
    onBookSlot,
    onChatClick 
  }: DetailMentorProps) => {
    const router = useRouter();
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="group flex items-center gap-2 hover:bg-transparent hover:text-primary"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Mentors
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        <Card className="lg:col-span-1">
          {/* Rest of your profile section code remains the same */}
          <CardHeader>
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={mentor.image || undefined} alt={mentor.fullName} />
                <AvatarFallback>
                  {mentor.fullName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{mentor.fullName}</h2>
                <Badge 
                  variant={mentor.status === 'ACTIVE' ? 'success' : 'error'}
                  className="mx-auto"
                >
                  {mentor.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pb-4 border-b">
              <Chat 
                onClick={onChatClick}
                variant="default"
                size="default"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" color="black"/>
                Chat
              </Chat>
              {mentor.consultation?.zoomLink && (
                <Zoom 
                  link={mentor.consultation.zoomLink}
                  variant="default"
                  size="default"
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Join Meeting
                </Zoom>
              )}
            </div>
            {/* Rest of your CardContent remains the same */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{mentor.jobRole}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{mentor.company}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>{mentor.education}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {mentor.expertise.map((exp) => (
                  <Badge key={exp.area} variant="outline">
                    {exp.area} 
                    {exp.level && <span className="ml-1">• Lv.{exp.level}</span>}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Details Section */}
      <div className="lg:col-span-2">
        <Tabs defaultValue="about">
          <TabsList className="w-full">
            <TabsTrigger value="about" className="flex-1">About</TabsTrigger>
            <TabsTrigger value="schedule" className="flex-1">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {mentor.motivation && (
                    <div>
                      <h3 className="font-medium mb-2">Motivation</h3>
                      <p className="text-muted-foreground">{mentor.motivation}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Areas of Focus</h3>
                    <ul className="space-y-2">
                      {mentor.expertise.map((exp) => (
                        <li key={exp.area} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">{exp.area}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {exp.tags.map((tag) => (
                                <Badge key={tag} variant="default" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                {availableSlots.length > 0 ? (
                  <div className="space-y-4">
                    {availableSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{new Date(slot.startTime).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(slot.startTime).toLocaleTimeString()} - 
                              {new Date(slot.endTime).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => onBookSlot?.(slot.id)}
                          disabled={slot.isBooked}
                        >
                          {slot.isBooked ? 'Booked' : 'Book Session'}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No available slots at the moment.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DetailMentor;