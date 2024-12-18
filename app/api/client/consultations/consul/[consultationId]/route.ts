// app/api/client/consultations/[consultationId]/route.ts
import { NextRequest } from "next/server";
import  prisma  from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/nextauth-options";

export async function GET(
  req: NextRequest,
  { params }: { params: { consultationId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const consultation = await prisma.consultation.findUnique({
      where: {
        id: params.consultationId,
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                image: true,
              },
            },
            expertise: true,
          },
        },
        slot: true,
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!consultation) {
      return Response.json({ error: "Consultation not found" }, { status: 404 });
    }

    // Format the data to match the expected structure
    const formattedConsultation = {
      id: consultation.id,
      status: consultation.status,
      mentor: {
        id: consultation.mentor.id,
        fullName: consultation.mentor.fullName,
        image: consultation.mentor.user.image,
        expertise: consultation.mentor.expertise,
      },
      startTime: consultation.slot?.startTime,
      endTime: consultation.slot?.endTime,
      zoomLink: consultation.zoomLink,
      messages: consultation.messages,
    };

    return Response.json(formattedConsultation);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}