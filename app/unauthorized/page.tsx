// src/app/unauthorized/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
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
          <span className="text-7xl">🔐</span>
        </motion.div>
        
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-base font-semibold text-secondary-600">401</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-900 sm:text-5xl">
            Access Denied
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            You don't have permission to access this page. Please log in with the appropriate account.
          </p>
        </motion.div>

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
          
          <Link href="/login">
            <Button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white">
              <LogIn className="h-4 w-4 text-white" />
              Login
            </Button>
          </Link>

          <Link href="/">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 hover:bg-primary-50"
            >
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}