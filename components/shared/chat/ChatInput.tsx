import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; 
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({ 
  onSendMessage, 
  placeholder,
  disabled = false
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!message.trim() || disabled) return;
    onSendMessage(message);
    setMessage("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea dengan max height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // Max height 120px
      textareaRef.current.style.height = `${newHeight}px`;
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex items-end gap-2 w-full bg-white rounded-lg p-2"
    >
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={handleTextareaChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="resize-none flex-1 min-h-[40px] max-h-[120px] px-3 py-2"
      />
      <Button 
        type="submit"
        size="icon"
        disabled={!message.trim() || disabled}
        className="bg-blue-600 hover:bg-blue-700 text-white h-10 w-10 flex-shrink-0"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}