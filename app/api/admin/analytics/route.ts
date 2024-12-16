import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    // Verify admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get total counts
    const [
      totalMentors,
      totalClients,
      totalEvents,
      clientStatuses
    ] = await Promise.all([
      // Count total mentors
      prisma.mentor.count(),
      
      // Count total clients
      prisma.client.count(),
      
      // Count total events
      prisma.event.count(),
      
      // Get client career statuses
      prisma.client.groupBy({
        by: ['currentStatus'],
        _count: {
          currentStatus: true
        },
        where: {
          currentStatus: {
            not: null
          }
        }
      })
    ]);

    // Get monthly registrations for past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRegistrations = await prisma.client.groupBy({
      by: ['createdAt'],
      _count: {
        id: true
      },
      where: {
        createdAt: {
          gte: sixMonthsAgo
        }
      }
    });

    // Get consultation statistics
    const consultationStats = await prisma.consultation.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // Get event participation stats
    const eventParticipation = await prisma.eventRegistration.groupBy({
      by: ['eventId'],
      _count: {
        id: true
      }
    });

    // Format career status data
    const careerStatusData = clientStatuses.map(status => ({
      status: status.currentStatus,
      count: status._count.currentStatus
    }));

    // Format monthly registration data
    const registrationData = monthlyRegistrations.map(item => ({
      date: item.createdAt,
      count: item._count.id
    }));

    return NextResponse.json({
      overview: {
        totalMentors,
        totalClients,
        totalEvents
      },
      careerStatus: careerStatusData,
      monthlyRegistrations: registrationData,
      consultationStats,
      eventParticipation
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}