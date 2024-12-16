// app/api/client/mentors/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getClientSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search");
    const expertise = url.searchParams.get("expertise");

    // Build the where clause for the query
    const where: any = {
      status: "ACTIVE",
      expertise: {},
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { 
          expertise: {
            some: {
              OR: [
                { area: { contains: search, mode: "insensitive" } },
                { tags: { has: search.toLowerCase() } }
              ]
            }
          }
        }
      ];
    }

    if (expertise && expertise !== "all") {
      where.expertise.some = {
        area: { equals: expertise }
      };
    }

    const mentors = await prisma.mentor.findMany({
      where,
      include: {
        expertise: true,
        consultations: {
          where: {
            status: "COMPLETED"
          },
          select: {
            rating: true
          }
        },
        availableSlots: {
          where: {
            startTime: { gt: new Date() },
            isBooked: false
          },
          orderBy: {
            startTime: "asc"
          },
          take: 1
        }
      }
    });

    // Transform the data for the frontend
    const transformedMentors = mentors.map(mentor => ({
      ...mentor,
      rating: mentor.consultations.length > 0
        ? mentor.consultations.reduce((acc, curr) => acc + (curr.rating || 0), 0) / mentor.consultations.length
        : undefined,
      totalConsultations: mentor.consultations.length,
      nextAvailableSlot: mentor.availableSlots[0]?.startTime,
      consultations: undefined, // Remove raw consultations data
      availableSlots: undefined // Remove raw slots data
    }));

    return NextResponse.json(transformedMentors);
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}