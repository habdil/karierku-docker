// app/(mentor)/dashboard-mentor/consultation/[consultationId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Video, Calendar, Clock, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ConsultationDetails {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  client: {
    id: string;
    fullName: string;
    image?: string;
  };
  startTime?: string;
  endTime?: string;
  zoomLink?: string;
  slotId?: string;
}

export default function ConsultationDetailPage({ 
  params 
}: { 
  params: { consultationId: string } 
}) {
  const [consultation, setConsultation] = useState<ConsultationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLink, setZoomLink] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showZoomDialog, setShowZoomDialog] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchConsultation();
  }, [params.consultationId]);

  const fetchConsultation = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/mentor/consultations/${params.consultationId}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setConsultation(data);
      if (data.zoomLink) setZoomLink(data.zoomLink);
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
        description: "Consultation status updated successfully",
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

      <Card>
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
                <Badge>{consultation.status}</Badge>
              </div>
            </div>

            {consultation.status === 'PENDING' && (
              <div className="flex gap-2">
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
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {consultation.startTime && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(consultation.startTime).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(consultation.startTime).toLocaleTimeString()}</span>
              </div>
            </div>
          )}

          {consultation.status === 'ACTIVE' && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Meeting Link</h3>
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowZoomDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleZoomLinkSubmit}
                          disabled={isUpdating || !zoomLink}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              {consultation.zoomLink && (
                <div className="mt-2">
                  <a
                    href={consultation.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {consultation.zoomLink}
                  </a>
                </div>
              )}
            </div>
          )}

          {consultation.status === 'ACTIVE' && (
            <Button
              className="w-full"
              variant="default"
              onClick={() => updateConsultationStatus('COMPLETED')}
              disabled={isUpdating}
            >
              Mark as Completed
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}