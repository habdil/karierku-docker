"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MentorList } from "@/components/client/mentor/MentorList";
import { LoadingBars } from "@/components/ui/loading-bars";

type Assessment = {
  id: string;
  answers: any;
  geminiResponse: string;
  createdAt: string;
};

type MentorRecommendation = {
  id: string;
  mentor: {
    id: string;
    fullName: string;
    jobRole: string;
    company: string;
    education: string;
    expertise: Array<{
      area: string;
      tags: string[];
    }>;
  };
  matchingScore: number;
  matchingCriteria: {
    expertiseMatch: Array<{
      area: string;
      matchingTags: string[];
    }>;
    workEnvironmentMatch: boolean;
    skillsMatch: string[];
  };
};

export default function CareerAssessmentResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [recommendations, setRecommendations] = useState<MentorRecommendation[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch latest assessment
        const assessmentRes = await fetch("/api/client/career-assessment/latest");
        const assessmentData = await assessmentRes.json();

        if (!assessmentData) {
          router.push("/client/dashboard/career");
          return;
        }

        setAssessment(assessmentData);

        // Fetch recommendations
        const recsRes = await fetch(`/api/client/career-assessment/${assessmentData.id}/recomendations`);
        const recsData = await recsRes.json();
        setRecommendations(recsData);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoadingBars text="Menampilkan hasil..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Tabs defaultValue="analysis">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analysis">Analisis Karir</TabsTrigger>
          <TabsTrigger value="recommendations">Rekomendasi Mentor</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hasil Analisis Karir</CardTitle>
              <CardDescription>
                Berdasarkan jawaban Anda, berikut adalah analisis karir yang sesuai
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="prose prose-blue max-w-none">
                  {assessment?.geminiResponse
                    .split("\n")
                    .map(paragraph => paragraph.replace(/\*/g, '').trim()) // Menghilangkan semua tanda *
                    .filter(paragraph => paragraph.length > 0) // Menghilangkan baris kosong
                    .map((paragraph, idx) => (
                      <p 
                        key={idx} 
                        className={`${
                          // Styling khusus untuk judul dengan angka di depan
                          paragraph.match(/^\d\./) 
                            ? 'text-lg font-semibold text-blue-900 mt-6 first:mt-0' 
                            : 'text-muted-foreground mt-2'
                        }`}
                      >
                        {paragraph}
                      </p>
                  ))}
                </div>
              </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
            <MentorList recommendations={recommendations} />
        </TabsContent>
      </Tabs>
    </div>
  );
}