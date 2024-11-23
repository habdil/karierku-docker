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

    // Cek apakah client sudah memiliki assessment (logika original tetap dipertahankan)
    const existingAssessment = await prisma.careerAssessment.findFirst({
      where: {
        clientId: session.clientId,
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    // Menambahkan informasi tambahan tanpa mengubah logika dasar
    return NextResponse.json({
      hasAssessment: !!existingAssessment,
      assessmentId: existingAssessment?.id,
      // Informasi tambahan untuk UI
      assessment: existingAssessment ? {
        createdAt: existingAssessment.createdAt,
        status: existingAssessment.geminiResponse ? "COMPLETED" : "PENDING"
      } : null
    });

  } catch (error) {
    console.error("Error checking assessment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}