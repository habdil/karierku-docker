import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getClientSession, type ClientSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // Get client session
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mentorId, slotId, message } = await req.json();

    if (!mentorId || !slotId) {
      return NextResponse.json(
        { error: "mentorId and slotId are required" },
        { status: 400 }
      );
    }

    // Verify slot is available
    const slot = await prisma.consultationSlot.findUnique({
      where: { 
        id: slotId,
        mentorId,
        isBooked: false,
      },
    });

    if (!slot) {
      return NextResponse.json(
        { error: "Slot not available" },
        { status: 400 }
      );
    }

    // Create consultation with transaction
    const consultation = await prisma.$transaction(async (tx) => {
      // Create consultation using clientId from session
      const consultation = await tx.consultation.create({
        data: {
          clientId: session.clientId, // Use clientId from session
          mentorId,
          status: "PENDING",
          slotId,
        },
        include: {
          client: true,
          mentor: true,
          slot: true
        }
      });

      // Mark slot as booked
      await tx.consultationSlot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      // Create initial message if provided
      if (message) {
        await tx.message.create({
          data: {
            consultationId: consultation.id,
            senderId: session.clientId, // Use clientId from session
            content: message,
            type: "TEXT",
          },
        });
      }

      // Create notification for mentor
      await tx.notification.create({
        data: {
          title: "New Consultation Request",
          message: `You have a new consultation request from ${session.fullName}`,
          type: "CONSULTATION",
          mentorId,
          clientId: session.clientId, // Use clientId from session
        },
      });

      return consultation;
    });

    return NextResponse.json(consultation);
  } catch (error) {
    console.error("Error booking consultation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}