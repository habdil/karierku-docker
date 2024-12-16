// app/api/mentor/consultations/[id]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }  // Changed from consultationId to id
) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log params and session for debugging
    console.log("GET Request params:", params);
    console.log("Mentor session:", { mentorId: session.mentorId });

    const consultation = await prisma.consultation.findUnique({
      where: {
        id: params.id,  // Changed from params.consultationId
        mentorId: session.mentorId
      },
      include: {
        client: {
          include: {
            careerAssessments: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 10
        },
        slot: true
      }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    // Format response
    const formattedConsultation = {
      ...consultation,
      careerAssessment: consultation.client.careerAssessments[0] || null,
      client: {
        id: consultation.client.id,
        fullName: consultation.client.fullName,
        currentStatus: consultation.client.currentStatus,
      },
      recentMessages: consultation.messages.reverse()
    };

    return NextResponse.json(formattedConsultation);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }  // Changed from consultationId to id
) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Log params and request body for debugging
    console.log("PATCH Request params:", params);
    const body = await req.json();
    console.log("PATCH Request body:", body);

    const { status, zoomLink } = body;

    if (!params.id) {
      return NextResponse.json(
        { error: "Consultation ID is required" },
        { status: 400 }
      );
    }

    // Verify consultation exists and belongs to mentor
    const consultation = await prisma.consultation.findFirst({
      where: {
        id: params.id,
        mentorId: session.mentorId
      },
      include: {
        client: {
          select: {
            id: true,
            fullName: true
          }
        }
      }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found" },
        { status: 404 }
      );
    }

    // Update consultation with transaction
    const updatedConsultation = await prisma.$transaction(async (tx) => {
      // Update consultation
      const updated = await tx.consultation.update({
        where: { 
          id: params.id 
        },
        data: {
          ...(status && { status }),
          ...(zoomLink !== undefined && { zoomLink }),
          ...(status === 'ACTIVE' && { lastMessageAt: new Date() })
        }
      });

      // Create notification for status change
      if (status && status !== consultation.status) {
        await tx.notification.create({
          data: {
            title: `Consultation ${status.toLowerCase()}`,
            message: `Your consultation with ${session.fullName} has been ${status.toLowerCase()}`,
            type: "CONSULTATION",
            mentorId: session.mentorId,
            clientId: consultation.client.id
          }
        });

        // If completed, release the slot
        if (status === 'COMPLETED' && consultation.slotId) {
          await tx.consultationSlot.update({
            where: { id: consultation.slotId },
            data: { isBooked: false }
          });
        }
      }

      return updated;
    });

    return NextResponse.json(updatedConsultation);
  } catch (error) {
    console.error("Error updating consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}