"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Video, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ZoomLinkDialogProps {
  consultationId: string;
  currentLink?: string;
  onLinkUpdated: (newLink: string) => void;
}

export default function ZoomLinkDialog({
  consultationId,
  currentLink,
  onLinkUpdated
}: ZoomLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [zoomLink, setZoomLink] = useState(currentLink || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!zoomLink.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/mentor/consultations/${consultationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ zoomLink: zoomLink.trim() }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      onLinkUpdated(zoomLink.trim());
      setOpen(false);
      
      toast({
        title: "Success",
        description: currentLink 
          ? "Zoom link updated successfully" 
          : "Zoom link added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update Zoom link",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          {currentLink ? 'Update Zoom Link' : 'Add Zoom Link'}
        </Button>
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentLink ? 'Update Zoom Meeting Link' : 'Add Zoom Meeting Link'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {currentLink && (
            <div className="flex items-start gap-2 p-3 bg-muted rounded-lg text-sm">
              <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="font-medium">Current Link:</p>
                <a 
                  href={currentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline break-all"
                >
                  {currentLink}
                </a>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              {currentLink ? 'New Zoom Link' : 'Zoom Link'}
            </label>
            <Input
              placeholder="Enter your Zoom meeting link"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Paste your Zoom meeting invitation link here. Make sure it's a valid Zoom URL.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !zoomLink.trim()}
          >
            {isSubmitting ? "Saving..." : "Save Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}