"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { LoadingBars } from "@/components/ui/loading-bars";
import { format } from "date-fns";
import { Calendar, Clock, Trash2, Plus } from "lucide-react";
import ConsultationSlotManager from "./ConsultationSlotManager";

interface ConsultationSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isBooked: boolean;
  isRecurring: boolean;
  recurringDays?: number[];
}

export default function SlotManagementDialog() {
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (showDialog) {
      fetchSlots();
    }
  }, [showDialog]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/mentor/slots");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

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

      setSlots((prev) => prev.filter((slot) => slot.id !== slotId));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete slot",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Manage Slots
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultation Slots Management</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Available Slots</h2>
            <ConsultationSlotManager onSubmit={handleAddSlot} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <LoadingBars />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slots.map((slot) => (
                <Card key={slot.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center text-base">
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
                        <div className={`h-2 w-2 rounded-full ${
                          slot.isBooked ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
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

              {slots.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No consultation slots available</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add slots to start accepting consultations
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}