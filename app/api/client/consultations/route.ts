// // app/api/client/consultations/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { getClientSession } from "@/lib/auth";
// import prisma from "@/lib/prisma";
// import { Prisma } from "@prisma/client";

// export async function GET(req: NextRequest) {
//   try {
//     // Verify client session
//     const session = await getClientSession(req);
//     if (!session) {
//       return NextResponse.json(
//         { error: "Unauthorized access" },
//         { status: 401 }
//       );
//     }

//     // Get query parameters
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search");
//     const status = searchParams.get("status");
//     const expertise = searchParams.get("expertise");
//     const page = parseInt(searchParams.get("page") || "1");
//     const limit = parseInt(searchParams.get("limit") || "10");
//     const skip = (page - 1) * limit;

//     // Build where conditions with proper types
//     const where: Prisma.MentorWhereInput = {
//       status: status === "ACTIVE" ? "ACTIVE" : undefined,
//       ...(search && {
//         OR: [
//           {
//             fullName: {
//               contains: search,
//               mode: "insensitive" as Prisma.QueryMode,
//             },
//           },
//           {
//             jobRole: {
//               contains: search,
//               mode: "insensitive" as Prisma.QueryMode,
//             },
//           },
//           {
//             company: {
//               contains: search,
//               mode: "insensitive" as Prisma.QueryMode,
//             },
//           },
//         ],
//       }),
//       ...(expertise && {
//         expertise: {
//           some: {
//             area: {
//               contains: expertise,
//               mode: "insensitive" as Prisma.QueryMode,
//             },
//           },
//         },
//       }),
//     };

//     // Fetch mentors with proper include statements
//     const [mentors, total] = await Promise.all([
//       prisma.mentor.findMany({
//         where,
//         include: {
//           user: {
//             select: {
//               image: true,
//             },
//           },
//           expertise: {
//             select: {
//               area: true,
//               level: true,
//               tags: true,
//             },
//           },
//           consultations: {
//             where: {
//               clientId: session.clientId,
//               OR: [
//                 { status: "ACTIVE" },
//                 { status: "PENDING" },
//               ],
//             },
//             select: {
//               id: true,
//               status: true,
//               zoomLink: true,
//             },
//           },
//           availableSlots: {
//             where: {
//               startTime: {
//                 gte: new Date(),
//               },
//               isBooked: false,
//             },
//             take: 1,
//             orderBy: {
//               startTime: 'asc',
//             },
//           },
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//         skip,
//         take: limit,
//       }),
//       prisma.mentor.count({ where }),
//     ]);

//     // Transform the data for response
//     const formattedMentors = mentors.map((mentor) => ({
//       id: mentor.id,
//       fullName: mentor.fullName,
//       image: mentor.user?.image,
//       status: mentor.status,
//       jobRole: mentor.jobRole,
//       company: mentor.company,
//       education: mentor.education,
//       motivation: mentor.motivation,
//       expertise: mentor.expertise,
//       hasAvailableSlot: mentor.availableSlots.length > 0,
//       nextAvailableSlot: mentor.availableSlots[0]?.startTime || null,
//       consultation: mentor.consultations[0] || null,
//     }));

//     // Return response with pagination
//     return NextResponse.json({
//       mentors: formattedMentors,
//       pagination: {
//         total,
//         pages: Math.ceil(total / limit),
//         page,
//         limit,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching mentors:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/client/consultations/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getClientSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const consultations = await prisma.consultation.findMany({
      where: {
        clientId: session.id,
      },
      include: {
        mentor: {
          include: {
            expertise: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(consultations);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getClientSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slotId, message } = await req.json();
    
    // Check if slot exists and is available
    const slot = await prisma.consultationSlot.findUnique({
      where: { id: slotId },
    });

    if (!slot || slot.isBooked) {
      return NextResponse.json(
        { error: "Slot not available" },
        { status: 400 }
      );
    }

    // Create consultation and initial message
    const consultation = await prisma.consultation.create({
      data: {
        clientId: session.id,
        mentorId: slot.mentorId,
        status: "PENDING",
        slotId,
        messages: {
          create: message ? {
            senderId: session.id,
            content: message,
            type: "TEXT",
          } : undefined,
        },
      },
      include: {
        messages: true,
      },
    });

    // Mark slot as booked
    await prisma.consultationSlot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return NextResponse.json(consultation);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}