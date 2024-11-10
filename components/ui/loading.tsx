// src/components/ui/loading.tsx
"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingProps {
  variant?: "default" | "spinner" | "dots" | "pulse" | "bounce";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function Loading({
  variant = "default",
  size = "md",
  text,
  className = "",
}: LoadingProps) {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: "h-8 w-8",
      text: "text-sm",
      dots: "h-1.5 w-1.5",
      spacing: "gap-1",
    },
    md: {
      container: "h-12 w-12",
      text: "text-base",
      dots: "h-2 w-2",
      spacing: "gap-1.5",
    },
    lg: {
      container: "h-16 w-16",
      text: "text-lg",
      dots: "h-3 w-3",
      spacing: "gap-2",
    },
  };

  // Loading variants
  const LoadingVariants = {
    default: (
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className={`${sizeConfig[size].container} rounded-full border-4 border-primary-200`}
          style={{ borderTopColor: 'var(--primary-600)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        {text && <p className={`${sizeConfig[size].text} text-muted-foreground`}>{text}</p>}
      </div>
    ),

    spinner: (
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className={`${sizeConfig[size].container} text-primary-600 animate-spin`}
        />
        {text && <p className={`${sizeConfig[size].text} text-muted-foreground`}>{text}</p>}
      </div>
    ),

    dots: (
      <div className="flex flex-col items-center gap-3">
        <div className={`flex ${sizeConfig[size].spacing}`}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`${sizeConfig[size].dots} bg-primary-600 rounded-full`}
              animate={{
                y: ["0%", "-100%", "0%"],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {text && <p className={`${sizeConfig[size].text} text-muted-foreground`}>{text}</p>}
      </div>
    ),

    pulse: (
      <div className="flex flex-col items-center gap-3">
        <div className={`relative ${sizeConfig[size].container}`}>
          <motion.div
            className="absolute inset-0 rounded-full bg-primary-600"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <div className="absolute inset-0 rounded-full bg-primary-600" />
        </div>
        {text && <p className={`${sizeConfig[size].text} text-muted-foreground`}>{text}</p>}
      </div>
    ),

    bounce: (
      <div className="flex flex-col items-center gap-3">
        <div className={`flex ${sizeConfig[size].spacing}`}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={`${sizeConfig[size].dots} bg-primary-600 rounded-full`}
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {text && <p className={`${sizeConfig[size].text} text-muted-foreground`}>{text}</p>}
      </div>
    ),
  };

  // Page Loading Component
  if (variant === "default" && !className.includes("inline")) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {LoadingVariants[variant]}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={className}>
      {LoadingVariants[variant]}
    </div>
  );
}