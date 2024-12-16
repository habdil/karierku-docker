// app/api/admin/dashboard/export/route.ts
import { getAdminSession } from "@/lib/auth";
import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getAdminSession();
  
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const type = searchParams.get('type'); // users, consultations, events

  try {
    let data;
    const dateFilter = {
      createdAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined
      }
    };

    switch (type) {
      case 'users':
        data = await prisma.user.findMany({
          where: dateFilter,
          include: {
            client: true,
            mentor: true
          }
        });
        break;

      case 'consultations':
        data = await prisma.consultation.findMany({
          where: dateFilter,
          include: {
            client: true,
            mentor: true
          }
        });
        break;

      case 'events':
        data = await prisma.event.findMany({
          where: dateFilter,
          include: {
            admin: true,
            registrations: true
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: "Invalid export type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
