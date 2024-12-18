// components/client/consultations/ConsultationDialog.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingBars } from "@/components/ui/loading-bars";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, Video } from "lucide-react";
import ChatBox from "@/components/shared/chat/ChatBox";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface ConsultationDetails {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  mentor: {
    id: string;
    fullName: string;
    image?: string;
  };
  startTime?: string;
  endTime?: string;
  zoomLink?: string;
  messages: Message[];
}

interface ConsultationDialogProps {
  consultationId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ConsultationDialog({ consultationId, isOpen, onClose }: ConsultationDialogProps) {
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (consultationId && isOpen) {
      fetchConsultation();
      
      const interval = setInterval(() => {
        if (consultation?.status === 'ACTIVE') {
          fetchConsultation();
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [consultationId, isOpen]);

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      const [consultationRes, sessionRes] = await Promise.all([
        fetch(`/api/client/consultations/consu/${consultationId}`),
        fetch('/api/auth/session')
      ]);

      const [consultationData, sessionData] = await Promise.all([
        consultationRes.json(),
        sessionRes.json()
      ]);

      if (!consultationRes.ok) throw new Error(consultationData.error);

      setConsultation(consultationData);
      setUserId(sessionData.id);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load consultation",
        variant: "destructive",
      });
      onClose();
    } finally {
      setLoading(false);
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
          consultationId,
          content,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <LoadingBars />
          </div>
        ) : consultation ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={consultation.mentor.image} />
                  <AvatarFallback>
                    {consultation.mentor.fullName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">
                    Consultation with {consultation.mentor.fullName}
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
            </div>

            <Card>
              <CardContent className="space-y-6 pt-6">
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

                {consultation.status === 'ACTIVE' && userId && (
                  <ChatBox
                    messages={consultation.messages.map((msg) => ({
                      id: msg.id,
                      senderId: msg.senderId,
                      senderName: msg.senderId === userId ? "You" : consultation.mentor.fullName,
                      senderImage: consultation.mentor.image || undefined,
                      content: msg.content,
                      type: "TEXT", // Default type
                      status: "SENT", // Default status
                      createdAt: msg.createdAt,
                    }))}
                    currentUserId={userId}
                    participant={{
                      id: consultation.mentor.id,
                      name: consultation.mentor.fullName,
                      image: consultation.mentor.image,
                      status: 'online'
                    }}
                    onSendMessage={handleSendMessage}
                    userRole="CLIENT" // Tambahkan ini jika diperlukan
                  />
                )}

                {consultation.status === 'PENDING' && (
                  <div className="text-center text-muted-foreground">
                    Waiting for mentor to start the consultation...
                  </div>
                )}
                {consultation.status === 'COMPLETED' && (
                  <div className="text-center text-muted-foreground">
                    This consultation has been completed.
                  </div>
                )}
                {consultation.status === 'CANCELLED' && (
                  <div className="text-center text-muted-foreground">
                    This consultation has been cancelled.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Consultation not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}