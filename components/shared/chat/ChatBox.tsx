import React, { useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LoadingBars } from "@/components/ui/loading-bars";
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface Participant {
  id: string;
  name: string;
  image?: string;
  status?: 'online' | 'offline';
  lastSeen?: Date;
}

interface ChatBoxProps {
  messages: Message[];
  currentUserId: string;
  participant: Participant;
  isLoading?: boolean;
  onSendMessage: (content: string) => void;
}

export default function ChatBox({
  messages,
  currentUserId,
  participant,
  isLoading = false,
  onSendMessage,
}: ChatBoxProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={participant.image} />
              <AvatarFallback>{participant.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{participant.name}</h3>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${
                  participant.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span className="text-sm text-muted-foreground">
                  {participant.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          <Badge variant="outline">
            {participant.status === 'online' ? 'Active Now' : 'Away'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingBars />
          </div>
        ) : (
          <ScrollArea 
            ref={scrollRef}
            className="h-full pr-4"
          >
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                content={message.content}
                timestamp={message.createdAt}
                isCurrentUser={message.senderId === currentUserId}
                sender={{
                  name: message.senderId === currentUserId ? 'You' : participant.name,
                  image: message.senderId === currentUserId ? undefined : participant.image
                }}
              />
            ))}
          </ScrollArea>
        )}
      </CardContent>

      <CardFooter className="p-0">
        <ChatInput 
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          placeholder={`Message ${participant.name}...`}
        />
      </CardFooter>
    </Card>
  );
}