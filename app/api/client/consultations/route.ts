// app/api/client/consultations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getClientSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    // Verify client session
    const session = await getClientSession(req);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const expertise = searchParams.get("expertise");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where conditions with proper types
    const where: Prisma.MentorWhereInput = {
      status: status === "ACTIVE" ? "ACTIVE" : undefined,
      ...(search && {
        OR: [
          {
            fullName: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            jobRole: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            company: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        ],
      }),
      ...(expertise && {
        expertise: {
          some: {
            area: {
              contains: expertise,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        },
      }),
    };

    // Fetch mentors with proper include statements
    const [mentors, total] = await Promise.all([
      prisma.mentor.findMany({
        where,
        include: {
          user: {
            select: {
              image: true,
            },
          },
          expertise: {
            select: {
              area: true,
              level: true,
              tags: true,
            },
          },
          consultations: {
            where: {
              clientId: session.clientId,
              OR: [
                { status: "ACTIVE" },
                { status: "PENDING" },
              ],
            },
            select: {
              id: true,
              status: true,
              zoomLink: true,
            },
          },
          availableSlots: {
            where: {
              startTime: {
                gte: new Date(),
              },
              isBooked: false,
            },
            take: 1,
            orderBy: {
              startTime: 'asc',
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.mentor.count({ where }),
    ]);

    // Transform the data for response
    const formattedMentors = mentors.map((mentor) => ({
      id: mentor.id,
      fullName: mentor.fullName,
      image: mentor.user?.image,
      status: mentor.status,
      jobRole: mentor.jobRole,
      company: mentor.company,
      education: mentor.education,
      motivation: mentor.motivation,
      expertise: mentor.expertise,
      hasAvailableSlot: mentor.availableSlots.length > 0,
      nextAvailableSlot: mentor.availableSlots[0]?.startTime || null,
      consultation: mentor.consultations[0] || null,
    }));

    // Return response with pagination
    return NextResponse.json({
      mentors: formattedMentors,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}