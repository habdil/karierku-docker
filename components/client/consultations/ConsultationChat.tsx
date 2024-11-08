// components/client/consultations/ConsultationChat.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: Date;
}

interface ConsultationChatProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ConsultationChat({ messages, onSendMessage }: ConsultationChatProps) {
  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader className="border-b">
        <h3 className="font-semibold">Chat</h3>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={message.senderAvatar} alt={message.senderName} />
              <AvatarFallback>{message.senderName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-medium">{message.senderName}</span>
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement;
            onSendMessage(input.value);
            input.value = "";
          }}
          className="flex gap-2"
        >
          <Input
            name="message"
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}