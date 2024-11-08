// app/api/career-assessment/[assessmentId]/recommendations/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getClientSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { assessmentId: string } }
) {
  try {
    // Verifikasi client session
    const session = await getClientSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verifikasi kepemilikan assessment
    const assessment = await prisma.careerAssessment.findFirst({
      where: {
        id: params.assessmentId,
        clientId: session.clientId,
      },
    });

    if (!assessment) {
      return new NextResponse("Assessment not found", { status: 404 });
    }

    // Ambil rekomendasi mentor
    const recommendations = await prisma.mentorRecommendation.findMany({
      where: {
        assessmentId: params.assessmentId,
        clientId: session.clientId,
      },
      include: {
        mentor: {
          select: {
            id: true,
            fullName: true,
            jobRole: true,
            company: true,
            education: true,
            expertise: {
              select: {
                area: true,
                tags: true,
              },
            },
          },
        },
      },
      orderBy: {
        matchingScore: 'desc',
      },
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("[MENTOR_RECOMMENDATIONS]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}