// components/client/consultations/Chat.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  size?: 'icon' | 'default';
}

const Chat = ({ 
  className,
  variant = 'default',
  size = 'icon',
  ...props 
}: ChatProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn('relative', className)}
      {...props}
    >
      <MessageCircle className="h-4 w-4 text-white" />
      <span className="sr-only">Open chat</span>
    </Button>
  );
};

export default Chat;