"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CareerPersonalizationForm from "@/components/client/personalisasi/Personalisasi";
import { LoadingBars } from "@/components/ui/loading-bars";

export default function CareerPersonalizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasAssessment, setHasAssessment] = useState(false);

  useEffect(() => {
    const checkExistingAssessment = async () => {
      try {
        const response = await fetch("/api/client/career-assessment/check", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hasAssessment) {
            setHasAssessment(true);
            router.push("/dashboard/career/results");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking assessment:", error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingAssessment();
  }, [router]);

  if (loading || hasAssessment) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Mengunduh data..." />
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Memproses personalisasi karir Anda..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-primary-900">
            Personalisasi Karir
          </h1>
          <p className="text-muted-foreground text-lg">
            Isi form berikut untuk mendapatkan rekomendasi karir yang sesuai dengan profil Anda
          </p>
        </div>

        <CareerPersonalizationForm setSubmitting={setSubmitting} />
      </div>
    </div>
  );
}