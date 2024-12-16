// app/api/admin/dashboard/recent-activities/route.ts
import { getAdminSession } from "@/lib/auth";
import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getAdminSession();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        client: true,
        mentor: true
      }
    });

    // Get recent consultations
    const recentConsultations = await prisma.consultation.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        client: true,
        mentor: true
      }
    });

    // Get recent events
    const recentEvents = await prisma.event.findMany({
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        admin: true
      }
    });

    return NextResponse.json({
      recentUsers,
      recentConsultations,
      recentEvents
    });
  } catch (error) {
    console.error("Recent Activities Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}