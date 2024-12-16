import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const consultationId = searchParams.get("consultationId");

    if (!consultationId) {
      return NextResponse.json(
        { error: "Consultation ID is required" },
        { status: 400 }
      );
    }

    // Verify access to consultation
    const consultation = await prisma.consultation.findUnique({
      where: {
        id: consultationId,
        OR: [
          { clientId: session.id },
          { mentorId: session.id }
        ],
        status: "ACTIVE" // Only allow chat for active consultations
      }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "No active consultation found" },
        { status: 404 }
      );
    }

    // Get messages
    const messages = await prisma.message.findMany({
      where: {
        consultationId
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { consultationId, content } = await req.json();

    if (!consultationId || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify access to consultation
    const consultation = await prisma.consultation.findUnique({
      where: {
        id: consultationId,
        OR: [
          { clientId: session.id },
          { mentorId: session.id }
        ],
        status: "ACTIVE"
      }
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "No active consultation found" },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        consultationId,
        senderId: session.id,
        content,
        type: 'TEXT'
      }
    });

    // Update consultation lastMessageAt
    await prisma.consultation.update({
      where: { id: consultationId },
      data: { lastMessageAt: new Date() }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}