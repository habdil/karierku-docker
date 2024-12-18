import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { broadcastMessage } from "@/lib/realtime";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const consultationId = searchParams.get("consultationId");

    if (!consultationId) {
      return NextResponse.json({ error: "Consultation ID required" }, { status: 400 });
    }

    // Verifikasi akses berdasarkan role
    let consultation;
    if (session.role === "CLIENT") {
      consultation = await prisma.consultation.findFirst({
        where: { id: consultationId, clientId: session.clientId },
      });
    } else if (session.role === "MENTOR") {
      consultation = await prisma.consultation.findFirst({
        where: { id: consultationId, mentorId: session.mentorId },
      });
    } else if (session.role === "ADMIN") {
      consultation = await prisma.consultation.findFirst({
        where: { id: consultationId },
      });
    }

    if (!consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { consultationId },
      orderBy: { createdAt: "asc" },
      include: { sender: true },
    });

    const transformedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name || "Unknown User", // Perbaikan di sini
      senderImage: message.sender.image || null,
      type: message.type,
      status: message.status,
      createdAt: message.createdAt,
    }));
    

    return NextResponse.json({ messages: transformedMessages });
  } catch (error) {
    console.error("Error in GET /api/chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { consultationId, content } = body;

    if (!consultationId || !content.trim()) {
      return NextResponse.json({ error: "Missing consultationId or content" }, { status: 400 });
    }

    // Verifikasi akses berdasarkan role
    let userId = "";
    if (session.role === "CLIENT") {
      const consultation = await prisma.consultation.findFirst({
        where: { id: consultationId, clientId: session.clientId },
      });
      if (!consultation) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      userId = session.clientId;
    } else if (session.role === "MENTOR") {
      const consultation = await prisma.consultation.findFirst({
        where: { id: consultationId, mentorId: session.mentorId },
      });
      if (!consultation) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      userId = session.mentorId;
    } else if (session.role === "ADMIN") {
      const consultation = await prisma.consultation.findFirst({ where: { id: consultationId } });
      if (!consultation) return NextResponse.json({ error: "Consultation not found" }, { status: 403 });
      userId = session.id;
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Simpan pesan di database
    const message = await prisma.message.create({
      data: {
        consultationId,
        senderId: userId,
        content,
        type: "TEXT",
        status: "SENT",
      },
      include: { sender: true },
    });

    // Broadcast pesan ke semua klien SSE
    const messageToSend = {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      senderName: message.sender.name || "Unknown User",
      senderImage: message.sender.image,
      type: message.type,
      status: message.status,
      createdAt: message.createdAt,
    };

    await broadcastMessage(messageToSend, consultationId);

    return NextResponse.json(messageToSend);
  } catch (error) {
    console.error("Error in POST /api/chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}