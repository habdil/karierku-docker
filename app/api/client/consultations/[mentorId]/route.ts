// app/api/client/consultations/[mentorId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  try {
    // Verify client session
    const session = await getClientSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { mentorId } = params;

    // Fetch mentor data with all necessary relations
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId },
      include: {
        user: {
          select: {
            image: true,
          },
        },
        expertise: {
          select: {
            area: true,
            level: true,
            tags: true,
          },
        },
        availableSlots: {
          where: {
            startTime: {
              gte: new Date(),
            },
            isBooked: false,
          },
          orderBy: {
            startTime: 'asc',
          },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            duration: true,
            isBooked: true,
          },
        },
        consultations: {
          where: {
            clientId: session.clientId,
            OR: [
              { status: "ACTIVE" },
              { status: "PENDING" },
            ],
          },
          select: {
            id: true,
            status: true,
            zoomLink: true,
          },
          take: 1,
        },
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { error: "Mentor not found" },
        { status: 404 }
      );
    }

    // Format the response
    const formattedMentor = {
      id: mentor.id,
      fullName: mentor.fullName,
      image: mentor.user.image,
      status: mentor.status,
      jobRole: mentor.jobRole,
      company: mentor.company,
      education: mentor.education,
      motivation: mentor.motivation,
      phoneNumber: mentor.phoneNumber,
      expertise: mentor.expertise,
      availableSlots: mentor.availableSlots,
      activeConsultation: mentor.consultations[0] || null,
    };

    return NextResponse.json(formattedMentor);
  } catch (error) {
    console.error("Error fetching mentor details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}