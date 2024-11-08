import { NextResponse } from "next/server";
import { getClientSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateCareerAnalysis } from "@/lib/api/gemini";

export async function POST(req: Request) {
    try {
      // Get authenticated client session
      const session = await getClientSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      // Client ID sudah tersedia di session
      const clientId = session.clientId;
  
      // Get request body
      const { answers } = await req.json();
  
      // Generate analysis using Gemini AI
      const analysis = await generateCareerAnalysis(answers);
  
      // Save assessment to database
      const assessment = await prisma.careerAssessment.create({
        data: {
          clientId,
          answers,
          geminiResponse: analysis,
        },
      });
  
      // Generate mentor recommendations based on analysis
      const mentors = await prisma.mentor.findMany({
        include: {
          expertise: true,
        },
        where: {
          status: "ACTIVE",
        },
      });
  
      // Calculate matching scores and create recommendations
      const recommendations = await Promise.all(
        mentors.map(async (mentor) => {
          const matchingScore = calculateMatchingScore(mentor, answers, analysis);
          const matchingCriteria = generateMatchingCriteria(mentor, answers, analysis);
  
          return prisma.mentorRecommendation.create({
            data: {
              clientId,
              mentorId: mentor.id,
              assessmentId: assessment.id,
              matchingScore,
              matchingCriteria,
            },
          });
        })
      );
  
      // Create notification for client
      await prisma.notification.create({
        data: {
          title: "Hasil Assessment Karir",
          message: "Hasil assessment karir Anda telah siap. Silakan cek rekomendasi mentor yang sesuai dengan Anda.",
          type: "CAREER_ASSESSMENT",
          clientId,
          mentorId: recommendations[0].mentorId, // Assign to top matching mentor
        },
      });
  
      return NextResponse.json({
        success: true,
        assessmentId: assessment.id,
      });
    } catch (error) {
      console.error("Error processing career assessment:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

// Helper function to calculate matching score between mentor and client
function calculateMatchingScore(mentor: any, answers: any, analysis: string): number {
  let score = 0;
  const maxScore = 100;

  // Matching berdasarkan bidang keahlian
  mentor.expertise.forEach((exp: any) => {
    if (answers.interests.some((interest: string) => 
      exp.area.toLowerCase().includes(interest.toLowerCase()) ||
      exp.tags.some((tag: string) => interest.toLowerCase().includes(tag.toLowerCase()))
    )) {
      score += 20; // Bobot 20% untuk kecocokan bidang
    }
  });

  // Matching berdasarkan preferensi lingkungan kerja
  if (mentor.jobRole.toLowerCase().includes(answers.preferredWorkEnvironment.toLowerCase())) {
    score += 15; // Bobot 15% untuk kecocokan lingkungan
  }

  // Matching berdasarkan skill
  answers.skills.forEach((skill: string) => {
    if (mentor.expertise.some((exp: any) => 
      exp.tags.some((tag: string) => tag.toLowerCase().includes(skill.toLowerCase()))
    )) {
      score += 10; // Bobot 10% untuk setiap skill yang cocok
    }
  });

  // Normalisasi skor
  return Math.min(Math.round(score), maxScore);
}

// Helper function to generate matching criteria
function generateMatchingCriteria(mentor: any, answers: any, analysis: string): any {
  return {
    expertiseMatch: mentor.expertise.map((exp: any) => ({
      area: exp.area,
      matchingTags: exp.tags.filter((tag: string) => 
        answers.interests.concat(answers.skills).some((item: string) => 
          item.toLowerCase().includes(tag.toLowerCase())
        )
      ),
    })),
    workEnvironmentMatch: mentor.jobRole.toLowerCase().includes(answers.preferredWorkEnvironment.toLowerCase()),
    skillsMatch: answers.skills.filter((skill: string) =>
      mentor.expertise.some((exp: any) =>
        exp.tags.some((tag: string) => tag.toLowerCase().includes(skill.toLowerCase()))
      )
    ),
  };
}