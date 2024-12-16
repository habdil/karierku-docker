// app/api/admin/dashboard/export/route.ts
import { getAdminSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: "Export type is required" },
        { status: 400 }
      );
    }

    const dateFilter = {
      createdAt: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) })
      }
    };

    let data;
    switch (type) {
      case 'users':
        data = await prisma.user.findMany({
          where: dateFilter,
          include: {
            client: true,
            mentor: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        break;

      case 'consultations':
        data = await prisma.consultation.findMany({
          where: dateFilter,
          include: {
            client: {
              select: {
                fullName: true
              }
            },
            mentor: {
              select: {
                fullName: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        break;

      case 'events':
        data = await prisma.event.findMany({
          where: dateFilter,
          include: {
            admin: {
              select: {
                fullName: true
              }
            },
            registrations: true
          },
          orderBy: {
            createdAt: 'desc'
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
      { 
        error: "Failed to export data",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}