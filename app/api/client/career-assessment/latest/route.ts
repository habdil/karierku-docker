import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getClientSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ambil assessment terbaru dari client
    const latestAssessment = await prisma.careerAssessment.findFirst({
      where: {
        clientId: session.clientId,
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        mentorRecommendations: {
          include: {
            mentor: {
              include: {
                expertise: true
              }
            }
          }
        }
      }
    });

    if (!latestAssessment) {
      return NextResponse.json(
        { error: "No assessment found" },
        { status: 404 }
      );
    }

    return NextResponse.json(latestAssessment);

  } catch (error) {
    console.error("Error fetching latest assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}