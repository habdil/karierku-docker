// components/client/consultations/Zoom.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ZoomProps {
  link: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

const Zoom = ({ 
  link, 
  className,
  variant = 'default',
  size = 'icon',
  children,
  onClick 
}: ZoomProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
    window.open(link, '_blank');
  };

  const button = (
    <Button
      variant={variant}
      size={size}
      className={cn('relative', className)}
      onClick={handleClick}
    >
      {children || <Video className="h-4 w-4" />}
    </Button>
  );

  if (!children) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent>
            <p>Join Zoom meeting</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default Zoom;