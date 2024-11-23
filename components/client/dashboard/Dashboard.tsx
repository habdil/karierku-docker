"use client";

import { useState, useEffect } from "react";
import GreetingCard from "@/components/client/dashboard/GreetingCards";
import EventList from "@/components/client/dashboard/EventList";
import CareerRecommendation from "@/components/client/dashboard/CareerRecommendation";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";

interface Event {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  location: string;
  date: string;
  admin: {
    fullName: string;
  };
}

interface DashboardProps {
  clientName: string; // Make it required
}

export default function ClientDashboard({ clientName }: DashboardProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/client/events');
        const data = await response.json();

        if (data.success) {
          const upcomingEvents = data.data
            .sort((a: Event, b: Event) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 3);
          setEvents(upcomingEvents);
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat events"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Mengunduh data..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <GreetingCard clientName={clientName} />
        </div>
        
        <div className="col-span-1">
          <CareerRecommendation />
        </div>
        
        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          <EventList events={events} />
        </div>
      </div>
    </div>
  );
}