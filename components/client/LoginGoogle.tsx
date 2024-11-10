"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoogleAuthButtonProps {
  isLoading?: boolean;
  mode?: "login" | "register";
  className?: string;
}

export function GoogleAuthButton({
  isLoading: externalLoading,
  mode = "login",
  className = "",
}: GoogleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      // Redirect to Google auth endpoint
      window.location.href = '/api/auth/google';
    } catch (error) {
      console.error('Google authentication error:', error);
      toast({
        variant: "destructive",
        title: `Google ${mode} failed`,
        description: error instanceof Error ? error.message : `Failed to ${mode} with Google`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      className={`h-11 w-full ${className}`}
      onClick={handleGoogleAuth}
      disabled={isLoading || externalLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Image
          src="/images/google.png"
          alt="Google"
          width={20}
          height={20}
          className="mr-2"
        />
      )}
      {isLoading 
        ? `${mode === "login" ? "Signing in" : "Registering"}...` 
        : `Continue with Google`
      }
    </Button>
  );
}