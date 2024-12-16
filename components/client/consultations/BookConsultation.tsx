// components/client/consultations/BookConsultation.tsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Slot {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  isBooked: boolean;
}

interface BookConsultationProps {
  mentorId: string;
  mentorName: string;
  availableSlots: Slot[];
  onBookSlot: (slotId: string, message: string) => Promise<void>;
}

export default function BookConsultation({ 
  mentorId, 
  mentorName,
  availableSlots,
  onBookSlot 
}: BookConsultationProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [message, setMessage] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!selectedSlot) return;

    try {
      setIsBooking(true);
      await onBookSlot(selectedSlot.id, message);
      
      toast({
        title: "Success",
        description: "Consultation request sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to book consultation",
        variant: "destructive",
      });
    } finally {
      setIsBooking(false);
    }
  };

  const filteredSlots = availableSlots.filter(slot => {
    if (!selectedDate) return false;
    const slotDate = new Date(slot.startTime);
    return (
      slotDate.getDate() === selectedDate.getDate() &&
      slotDate.getMonth() === selectedDate.getMonth() &&
      slotDate.getFullYear() === selectedDate.getFullYear() &&
      !slot.isBooked
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Book Consultation</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Book Consultation with {mentorName}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => {
                  // Disable past dates and dates without available slots
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return (
                    date < today ||
                    !availableSlots.some(slot => {
                      const slotDate = new Date(slot.startTime);
                      return (
                        slotDate.getDate() === date.getDate() &&
                        slotDate.getMonth() === date.getMonth() &&
                        slotDate.getFullYear() === date.getFullYear() &&
                        !slot.isBooked
                      );
                    })
                  );
                }}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Time Slots */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredSlots.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No available slots for selected date
                    </p>
                  ) : (
                    filteredSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setSelectedSlot(slot)}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        <span>
                          {new Date(slot.startTime).toLocaleTimeString()} - 
                          {new Date(slot.endTime).toLocaleTimeString()}
                        </span>
                      </Button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {selectedSlot && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Add a message for the mentor (optional)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button
                    className="w-full mt-4"
                    onClick={handleBooking}
                    disabled={isBooking}
                  >
                    {isBooking ? "Booking..." : "Confirm Booking"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}