// app/api/admin/dashboard/analytics/route.ts
import { getAdminSession } from "@/lib/auth";
import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAdminSession();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Get general statistics
    const [
      totalUsers,
      activeMentors,
      upcomingEvents,
      totalConsultations,
      totalCareerAssessments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.mentor.count({
        where: { status: "ACTIVE" }
      }),
      prisma.event.count({
        where: {
          date: {
            gte: new Date()
          }
        }
      }),
      prisma.consultation.count(),
      prisma.careerAssessment.count()
    ]);

    // Get user growth data (last 12 months)
    const userGrowth = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      }
    });

    // Get consultation statistics
    const consultationStats = await prisma.consultation.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Get career path distribution
    const careerDistribution = await prisma.careerAssessment.groupBy({
      by: ['geminiResponse'],
      _count: {
        id: true
      }
    });

    return NextResponse.json({
      overview: {
        totalUsers,
        activeMentors,
        upcomingEvents,
        totalConsultations,
        totalCareerAssessments
      },
      userGrowth,
      consultationStats,
      careerDistribution
    });
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}