// app/api/client/consultations/book/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getClientSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mentorId, slotId, message } = await req.json();

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

    // Create consultation
    const consultation = await prisma.$transaction(async (tx) => {
      // Create consultation
      const consultation = await tx.consultation.create({
        data: {
          clientId: session.id,
          mentorId,
          status: "PENDING",
          slotId,
        },
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
            senderId: session.id,
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
          clientId: session.id,
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