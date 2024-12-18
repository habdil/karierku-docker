"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import ChatBox from "@/components/shared/chat/ChatBox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Video, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface ConsultationDetails {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  client: {
    id: string;
    fullName: string;
    image?: string;
    careerAssessments?: { // Perubahan dari careerAssessment menjadi careerAssessments (array)
      id: string;
      answers: any;
      geminiResponse: string;
    }[];
  };
  startTime?: string;
  endTime?: string;
  zoomLink?: string;
  messages: Message[];
  careerAssessment?: { // Tambahkan field ini sesuai response API
    id: string;
    answers: any;
    geminiResponse: string;
  };
}

export default function MentorConsultationDetailPage({
  params
}: {
  params: { consultationId: string }
}) {
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLink, setZoomLink] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showZoomDialog, setShowZoomDialog] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultation();

    // Poll for new messages every 5 seconds if consultation is active
    const interval = setInterval(() => {
      if (consultation?.status === 'ACTIVE') {
        fetchConsultation();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [params.consultationId]);

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      const [consultationRes, sessionRes] = await Promise.all([
        fetch(`/api/mentor/consultations/${params.consultationId}`),
        fetch('/api/auth/session')
      ]);

      const [consultationData, sessionData] = await Promise.all([
        consultationRes.json(),
        sessionRes.json()
      ]);

      if (!consultationRes.ok) throw new Error(consultationData.error);

      setConsultation(consultationData);
      if (consultationData.zoomLink) setZoomLink(consultationData.zoomLink);
      setUserId(sessionData.id);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load consultation",
        variant: "destructive",
      });
      router.push('/dashboard-mentor/consultation');
    } finally {
      setLoading(false);
    }
  };

  const updateConsultationStatus = async (status: string) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/mentor/consultations/${params.consultationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setConsultation(prev => prev ? { ...prev, status: status as any } : null);
      
      toast({
        title: "Success",
        description: `Consultation ${status.toLowerCase()} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleZoomLinkSubmit = async () => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/mentor/consultations/${params.consultationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zoomLink }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setConsultation(prev => prev ? { ...prev, zoomLink } : null);
      setShowZoomDialog(false);
      
      toast({
        title: "Success",
        description: "Zoom link added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add Zoom link",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultationId: params.consultationId,
          content,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      // Refresh consultation to get new messages
      fetchConsultation();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingBars />
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Consultation not found</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => router.push('/dashboard-mentor/consultation')}
        >
          Back to Consultations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    <Button
      variant="ghost"
      className="flex items-center gap-2"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>

      {/* Main Layout */}
      <div className="space-y-6"> {/* Ubah dari grid ke space-y-6 */}
        {/* Main Content Card */}
        <Card className="w-full"> {/* Tambahkan w-full */}
          <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={consultation.client.image} />
                    <AvatarFallback>
                      {consultation.client.fullName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {consultation.client.fullName}
                    </h2>
                    <Badge variant={
                      consultation.status === 'ACTIVE' ? 'success' :
                      consultation.status === 'PENDING' ? 'warning' :
                      consultation.status === 'COMPLETED' ? 'default' :
                      'error'
                    }>
                      {consultation.status}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {consultation.status === 'PENDING' && (
                    <>
                      <Button
                        variant="default"
                        onClick={() => updateConsultationStatus('ACTIVE')}
                        disabled={isUpdating}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => updateConsultationStatus('CANCELLED')}
                        disabled={isUpdating}
                      >
                        Decline
                      </Button>
                    </>
                  )}
                  
                  {consultation.status === 'ACTIVE' && (
                    <>
                      <Dialog open={showZoomDialog} onOpenChange={setShowZoomDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            {consultation.zoomLink ? 'Update Zoom Link' : 'Add Zoom Link'}
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Zoom Meeting Link</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <Input
                              placeholder="Enter Zoom meeting link"
                              value={zoomLink}
                              onChange={(e) => setZoomLink(e.target.value)}
                            />
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button
                                onClick={handleZoomLinkSubmit}
                                disabled={isUpdating || !zoomLink.trim()}
                              >
                                Save
                              </Button>
                            </DialogFooter>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="default"
                        onClick={() => updateConsultationStatus('COMPLETED')}
                        disabled={isUpdating}
                      >
                        Complete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Consultation Details */}
              <div className="flex flex-wrap gap-6">
                {consultation.startTime && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(consultation.startTime).toLocaleDateString()}</span>
                  </div>
                )}
                {consultation.startTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(consultation.startTime).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>

              {/* Zoom Link */}
              {consultation.zoomLink && (
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <Video className="h-4 w-4 text-primary" />
                  <a
                    href={consultation.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Join Zoom Meeting
                  </a>
                </div>
              )}

              {/* Chat Box */}
              {consultation.status === 'ACTIVE' && userId && (
              <ChatBox
                messages={consultation.messages.map((msg) => ({
                  id: msg.id,
                  senderId: msg.senderId,
                  senderName: "Unknown User", // Default jika nama tidak ada
                  senderImage: undefined,    // Default jika gambar tidak ada
                  content: msg.content,
                  type: "TEXT",              // Default
                  status: "SENT",            // Default
                  createdAt: new Date(msg.createdAt),
                }))}
                currentUserId={userId}
                participant={{
                  id: consultation.client.id,
                  name: consultation.client.fullName,
                  image: consultation.client.image,
                  status: "online",
                }}
                onSendMessage={handleSendMessage}
                userRole="MENTOR" // Tambahkan properti userRole
              />
              )}
            </CardContent>
          </Card>

              {/* Career Assessment Card - sekarang full width */}
      <Card className="w-full">
        <CardHeader>
          <h3 className="text-lg font-semibold">Career Assessment Results</h3>
        </CardHeader>
        <CardContent>
          {consultation.careerAssessment ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-4">Client Answers</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Major', key: 'major' },
                    { label: 'Skills', key: 'skills' },
                    { label: 'Hobbies', key: 'hobbies' },
                    { label: 'Dream Job', key: 'dreamJob' },
                    { label: 'Interests', key: 'interests' },
                    { label: 'Strengths', key: 'strengths' },
                    { label: 'Work Values', key: 'workValues' },
                    { label: 'Current Status', key: 'currentStatus' }
                  ].map(({ label, key }) => (
                    consultation.careerAssessment?.answers[key] && (
                      <div key={key} className="border-b pb-2">
                        <p className="text-sm font-medium text-gray-600">{label}</p>
                        <p className="text-sm mt-1">
                          {Array.isArray(consultation.careerAssessment.answers[key])
                            ? consultation.careerAssessment.answers[key].join(', ')
                            : consultation.careerAssessment.answers[key]}
                        </p>
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              {consultation.careerAssessment.geminiResponse && (
                <div>
                  <h4 className="text-base font-medium mb-3">AI Analysis</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {consultation.careerAssessment.geminiResponse}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No career assessment found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);
}