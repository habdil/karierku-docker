// app/(client)/dashboard/consultation/[mentorId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DetailMentor from "@/components/client/consultations/DetailMentor";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import { MentorResponse } from "@/lib/types/api";
import { Button } from "@/components/ui/button";

interface ConsultationSlot {
  id: string;
  startTime: string;
  endTime: string;
  duration: number;
  isBooked: boolean;
}

export default function MentorDetailPage({ 
  params 
}: { 
  params: { mentorId: string } 
}) {
  const [mentor, setMentor] = useState<MentorResponse | null>(null);
  const [availableSlots, setAvailableSlots] = useState<ConsultationSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMentorDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/client/consultations/${params.mentorId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch mentor details');
        }

        setMentor(data);
        if (data.availableSlots) {
          setAvailableSlots(data.availableSlots);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load mentor details"
        });
        router.push('/dashboard/consultation');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorDetails();
  }, [params.mentorId, toast, router]);

  const handleChatClick = () => {
    // Implement chat logic
    console.log('Opening chat with mentor:', params.mentorId);
  };

  const handleBookSlot = async (slotId: string) => {
    try {
      const response = await fetch(`/api/client/consultations/${params.mentorId}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slotId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book consultation');
      }

      toast({
        title: "Success",
        description: "Consultation booked successfully!",
      });

      router.push('/dashboard/consultation');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book consultation"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Memuat detail mentor..." />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] gap-4">
        <p className="text-lg text-muted-foreground">Mentor tidak ditemukan</p>
        <Button
          className="text-primary hover:underline"
          onClick={() => router.push('/dashboard/consultation')}
        >
          Kembali ke daftar mentor
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <DetailMentor
        mentor={mentor}
        availableSlots={availableSlots}
        onBookSlot={handleBookSlot}
        onChatClick={handleChatClick}
      />
    </div>
  );
}