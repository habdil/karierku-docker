// app/api/client/consultations/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getClientSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("Fetching consultations for client:", session.clientId);

    const consultations = await prisma.consultation.findMany({
      where: {
        clientId: session.clientId, // Use session.clientId instead of session.id
      },
      include: {
        mentor: {
          include: {
            expertise: true,
            user: {
              select: {
                image: true,
              }
            }
          },
        },
        slot: true, // Include slot data
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    // Transform data to include mentor image
    const transformedConsultations = consultations.map(consultation => ({
      ...consultation,
      mentor: {
        ...consultation.mentor,
        image: consultation.mentor.user.image,
        // Remove user object as it's now flattened
        user: undefined
      }
    }));

    return NextResponse.json(transformedConsultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST method remains the same but use session.clientId
export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slotId, message } = await req.json();
    
    // Check if slot exists and is available
    const slot = await prisma.consultationSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.isBooked) {
      return NextResponse.json(
        { error: "Slot not available" },
        { status: 400 }
      );
    }

    // Create consultation and initial message
    const consultation = await prisma.consultation.create({
      data: {
        clientId: session.clientId, // Use session.clientId
        mentorId: slot.mentorId,
        status: "PENDING",
        slotId,
        messages: {
          create: message ? {
            senderId: session.clientId, // Use session.clientId
            content: message,
            type: "TEXT",
          } : undefined,
        },
      },
      include: {
        messages: true,
      },
    });

    // Mark slot as booked
    await prisma.consultationSlot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return NextResponse.json(consultation);
  } catch (error) {
    console.error("Error creating consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}