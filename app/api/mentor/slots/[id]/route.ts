// app/api/mentor/slots/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verifikasi slot milik mentor yang sedang login
    const slot = await prisma.consultationSlot.findFirst({
      where: {
        id: params.id,
        mentorId: session.mentorId,
      },
    });

    if (!slot) {
      return NextResponse.json(
        { error: "Slot not found" },
        { status: 404 }
      );
    }

    if (slot.isBooked) {
      return NextResponse.json(
        { error: "Cannot delete booked slot" },
        { status: 400 }
      );
    }

    await prisma.consultationSlot.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}