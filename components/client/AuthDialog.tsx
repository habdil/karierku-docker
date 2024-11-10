"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/client/LoginForm";
import { RegisterForm } from "@/components/client/RegisterForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AuthDialogProps {
  mode: "login" | "register";
  className?: string;
  children?: React.ReactNode;
}

export function AuthDialog({ mode, className, children }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<"login" | "register">(mode);

  const handleModeSwitch = () => {
    setCurrentMode(currentMode === "login" ? "register" : "login");
  };

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0">
        {currentMode === "login" ? (
          <LoginForm 
            onRegisterClick={handleModeSwitch} 
            onSuccess={handleSuccess}
          />
        ) : (
          <RegisterForm 
            onLoginClick={handleModeSwitch} 
            onSuccess={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}