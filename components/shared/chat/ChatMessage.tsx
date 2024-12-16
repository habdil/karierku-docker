import React from 'react';
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  sender: {
    name: string;
    image?: string;
  };
}

export default function ChatMessage({
  content,
  timestamp,
  isCurrentUser,
  sender
}: ChatMessageProps) {
  return (
    <div className={cn(
      "flex gap-2 mb-4", 
      isCurrentUser ? "flex-row-reverse" : "flex-row"
    )}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={sender.image} />
        <AvatarFallback>{sender.name[0]}</AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "flex flex-col max-w-[70%]",
        isCurrentUser ? "items-end" : "items-start" 
      )}>
        <div className={cn(
          "rounded-lg p-3",
          isCurrentUser 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted"
        )}>
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        
        <span className="text-xs text-muted-foreground mt-1">
          {format(timestamp, "HH:mm")}
        </span>
      </div>
    </div>
  );
}