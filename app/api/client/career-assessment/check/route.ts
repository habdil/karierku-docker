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

    // Cek apakah client sudah memiliki assessment
    const existingAssessment = await prisma.careerAssessment.findFirst({
      where: {
        clientId: session.clientId,
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    return NextResponse.json({
      hasAssessment: !!existingAssessment,
      assessmentId: existingAssessment?.id,
    });

  } catch (error) {
    console.error("Error checking assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}