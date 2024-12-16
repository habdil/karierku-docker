// app/(mentor)/dashboard-mentor/slots/page.tsx

"use client";

import { useState, useEffect } from "react";
import ConsultationSlotManager from "@/components/mentor/consultations/ConsultationSlotManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, Trash2 } from "lucide-react";

interface ConsultationSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isBooked: boolean;
  isRecurring: boolean;
  recurringDays?: number[];
}

export default function SlotsPage() {
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mentor/slots");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      // Convert string dates to Date objects
      const formattedSlots = data.map((slot: any) => ({
        ...slot,
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
      }));

      setSlots(formattedSlots);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load slots",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = async (data: any) => {
    try {
      const res = await fetch("/api/mentor/slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast({
        title: "Success",
        description: "Slot added successfully",
      });

      // Refresh slots
      fetchSlots();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add slot",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const res = await fetch(`/api/mentor/slots/${slotId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast({
        title: "Success",
        description: "Slot deleted successfully",
      });

      // Update local state
      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete slot",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingBars />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Consultation Slots</h1>
        <ConsultationSlotManager onSubmit={handleAddSlot} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => (
          <Card key={slot.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {format(slot.startTime, "MMMM d, yyyy")}
                </div>
                {!slot.isBooked && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteSlot(slot.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(slot.startTime, "HH:mm")} -{" "}
                    {format(slot.endTime, "HH:mm")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${slot.isBooked ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <span className="text-sm">
                    {slot.isBooked ? "Booked" : "Available"}
                  </span>
                </div>
                {slot.isRecurring && (
                  <div className="text-sm text-muted-foreground">
                    Recurring slot
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {slots.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No consultation slots available</p>
          <p className="text-sm text-muted-foreground mt-1">
            Add slots to start accepting consultations
          </p>
        </div>
      )}
    </div>
  );
}