"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import CareerPersonalizationForm from "@/components/client/personalisasi/Personalisasi";

export default function CareerPersonalizationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasAssessment, setHasAssessment] = useState(false);

  useEffect(() => {
    const checkExistingAssessment = async () => {
      try {
        // Cek apakah user sudah memiliki assessment sebelumnya
        const response = await fetch("/api/client/career-assessment/check", {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hasAssessment) {
            setHasAssessment(true);
            // Jika sudah ada assessment, redirect ke halaman hasil
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (hasAssessment) {
    return null; // Tidak perlu render apapun karena akan redirect
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Personalisasi Karir</h1>
          <p className="text-muted-foreground">
            Isi form berikut untuk mendapatkan rekomendasi karir yang sesuai dengan profil Anda
          </p>
        </div>

        <CareerPersonalizationForm />
      </div>
    </div>
  );
}