// components/mentor/consultations/ConsultationSlotManager.tsx

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from 'lucide-react';

interface SlotFormData {
  date: Date;
  startTime: string;
  duration: number;
  isRecurring: boolean;
  recurringDays: number[];
}

interface ConsultationSlotManagerProps {
  onSubmit: (data: SlotFormData) => Promise<void>;
}

export default function ConsultationSlotManager({ onSubmit }: ConsultationSlotManagerProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("09:00");
  const [duration, setDuration] = useState(60);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleSubmit = async () => {
    if (!date) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        date,
        startTime,
        duration,
        isRecurring,
        recurringDays
      });
      setShowDialog(false);
    } catch (error) {
      console.error("Failed to add slot:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Consultation Slot
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Slot</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
            />
          </div>
          <div className="grid gap-2">
            <label>Start Time</label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label>Duration</label>
            <Select
              value={duration.toString()}
              onValueChange={(value) => setDuration(Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
            <label>Make this a recurring slot</label>
          </div>
          {isRecurring && (
            <div className="grid gap-2">
              <label>Repeat on days</label>
              <div className="flex flex-wrap gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <Button
                    key={day}
                    type="button"
                    variant={recurringDays.includes(index) ? 'default' : 'outline'}
                    onClick={() => {
                      setRecurringDays(prev =>
                        prev.includes(index)
                          ? prev.filter(d => d !== index)
                          : [...prev, index]
                      )
                    }}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!date || isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Slot"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}