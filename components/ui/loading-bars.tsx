// components/ui/loading-bars.tsx
"use client";

import { motion } from "framer-motion";

interface LoadingBarsProps {
  text?: string;
  className?: string;
}

export function LoadingBars({ text = "Mengunduh data...", className = "" }: LoadingBarsProps) {
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="flex items-end gap-1 h-12">
        <motion.div
          className="w-4 bg-blue-700 rounded-sm"
          initial={{ height: 12 }}
          animate={{ height: [12, 48, 12] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 0
          }}
        />
        <motion.div
          className="w-4 bg-sky-400 rounded-sm"
          initial={{ height: 12 }}
          animate={{ height: [12, 48, 12] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 0.2
          }}
        />
        <motion.div
          className="w-4 bg-yellow-400 rounded-sm"
          initial={{ height: 12 }}
          animate={{ height: [12, 48, 12] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 0.4
          }}
        />
      </div>
      {text && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}