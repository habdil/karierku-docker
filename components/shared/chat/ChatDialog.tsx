// 4. ChatDialog.tsx
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ChatBox from './ChatBox';
import { Message, ChatParticipant } from '@/lib/types/chat';

interface ChatDialogProps {
  currentUserId: string;
  participant: ChatParticipant;
  consultationId: string;
  triggerClassName?: string;
  consultationStatus: 'ACTIVE' | 'COMPLETED';
  userRole: 'CLIENT' | 'MENTOR';
}

export default function ChatDialog({
  currentUserId,
  participant,
  consultationId,
  triggerClassName,
  consultationStatus,
  userRole
}: ChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const messageCache = useRef(new Set<string>());

  const fetchMessages = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const response = await fetch(`/api/chat?consultationId=${consultationId}`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      setMessages(data.messages);
      
      // Update cache with existing messages
      data.messages.forEach((msg: Message) => {
        messageCache.current.add(msg.id);
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
    }
  }, [consultationId, toast]);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const setupSSE = () => {
      if (!isOpen || !consultationId) return;

      eventSource = new EventSource(`/api/chat/sse?consultationId=${consultationId}`);
      
      eventSource.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        
        // Check if message already exists in cache
        if (!messageCache.current.has(newMessage.id)) {
          messageCache.current.add(newMessage.id);
          setMessages(prev => [...prev, newMessage]);
        }
      };

      eventSource.onerror = () => {
        eventSource?.close();
        setTimeout(setupSSE, 5000);
      };
    };

    if (isOpen) {
      fetchMessages();
      setupSSE();
    }

    return () => {
      eventSource?.close();
      if (!isOpen) {
        messageCache.current.clear();
        setMessages([]);
      }
    };
  }, [isOpen, consultationId, fetchMessages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isSending) return;
    setIsSending(true);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId,
          content: content.trim(),
          type: 'TEXT',  // Specify message type
          status: 'SENT' // Initial status
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await response.json();
      
      // Only add message if it's not in cache
      if (!messageCache.current.has(newMessage.id)) {
        messageCache.current.add(newMessage.id);
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className={`${triggerClassName} hover:bg-gray-50 gap-2`}
          disabled={consultationStatus !== 'ACTIVE'}
        >
          <MessageCircle className="h-4 w-4" />
          Chat
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] p-0 h-[600px] max-h-[80vh]">
        <div className="flex flex-col h-full">
          <ChatBox
            messages={messages}
            currentUserId={currentUserId}
            participant={participant}
            onSendMessage={handleSendMessage}
            isLoading={isInitialLoading}
            isSending={isSending}
            userRole={userRole}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}