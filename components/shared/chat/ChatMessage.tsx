// 1. ChatMessage.tsx
import React from 'react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  content: string;
  timestamp: Date;
  isCurrentUser: boolean;
  senderName: string;
  senderImage?: string;
  status?: 'SENT' | 'DELIVERED' | 'READ';
}

export default function ChatMessage({
  content,
  timestamp,
  isCurrentUser,
  senderName,
  senderImage,
  status
}: ChatMessageProps) {
  // Fungsi helper untuk render status icon
  const renderStatusIcon = (status?: string) => {
    if (!isCurrentUser || !status) return null;
    
    return (
      <span className={cn(
        "text-[10px] ml-1",
        status === 'SENT' && "text-blue-50/70",
        status === 'DELIVERED' && "text-blue-50/85",
        status === 'READ' && "text-blue-50"
      )}>
        {status === 'SENT' && '✓'}
        {status === 'DELIVERED' && '✓✓'}
        {status === 'READ' && '✓✓'}
      </span>
    );
  };

  return (
    <div className={cn(
      "flex w-full gap-2 mb-4",
      isCurrentUser ? "justify-end" : "justify-start"
    )}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={senderImage} />
          <AvatarFallback>{senderName ? senderName[0] : "U"}</AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[70%]",
        isCurrentUser ? "items-end" : "items-start"
      )}>
        <span className="text-xs text-gray-500 mb-1">
          {senderName}
        </span>
        <div className={cn(
          "rounded-2xl px-4 py-2 text-sm",
          isCurrentUser 
            ? "bg-blue-500 text-white rounded-tr-none" 
            : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}>
          <p className="whitespace-pre-wrap break-words">{content}</p>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className={cn(
              "text-[10px]",
              isCurrentUser ? "text-blue-50" : "text-gray-500"
            )}>
              {format(new Date(timestamp), "HH:mm")}
            </span>
            {renderStatusIcon(status)}
          </div>
        </div>
      </div>

      {isCurrentUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={senderImage} />
          <AvatarFallback>{senderName[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}