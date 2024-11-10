// src/app/not-found.tsx & src/app/unauthorized/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ErrorPageProps {
  type?: 'notFound' | 'unauthorized';
}

export default function ErrorPage({ type = 'notFound' }: ErrorPageProps) {
  const router = useRouter();

  const errorContent = {
    notFound: {
      title: "404 - Page Not Found",
      description: "Oops! The page you're looking for doesn't exist.",
      icon: "🤔"
    },
    unauthorized: {
      title: "401 - Unauthorized Access",
      description: "Sorry! You don't have permission to access this page.",
      icon: "🔐"
    }
  };

  const content = errorContent[type];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="flex justify-center mb-8"
        >
          <span className="text-7xl">{content.icon}</span>
        </motion.div>
        
        {/* Error Message */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-base font-semibold text-secondary-600">
            {type === 'notFound' ? '404' : '401'}
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-900 sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            {content.description}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center gap-2 hover:bg-primary-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Link href="/">
            <Button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}