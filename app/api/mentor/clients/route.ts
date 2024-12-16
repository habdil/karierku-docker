// app/api/mentor/clients/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";

// Fetch all clients for a mentor
export async function GET() {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    console.log("Fetching clients for mentor:", session.mentorId);

    const clientMentorRelations = await prisma.clientMentor.findMany({
      where: {
        mentorId: session.mentorId,
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
                image: true
              }
            },
            careerAssessments: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1,
            },
            consultations: {
              where: {
                mentorId: session.mentorId
              },
              orderBy: {
                createdAt: 'desc'
              },
              take: 1,
            },
            notifications: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 5,
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
    });

    const formattedClients = clientMentorRelations.map((relation) => ({
      id: relation.client.id,
      fullName: relation.client.fullName,
      email: relation.client.user.email,
      image: relation.client.user.image,
      major: relation.client.major,
      currentStatus: relation.client.currentStatus,
      dreamJob: relation.client.dreamJob,
      interests: relation.client.interests,
      hobbies: relation.client.hobbies,
      mentorshipStatus: relation.status,
      lastConsultation: relation.client.consultations[0] || null,
      careerAssessment: relation.client.careerAssessments[0] || null,
      recentNotifications: relation.client.notifications,
      relationCreatedAt: relation.createdAt
    }));

    return NextResponse.json(formattedClients);
  } catch (error) {
    console.error("[GET Clients] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Add new client to mentor
export async function POST(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { clientId } = await req.json();
    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // Check if relation already exists
    const existingRelation = await prisma.clientMentor.findFirst({
      where: {
        clientId,
        mentorId: session.mentorId
      }
    });

    if (existingRelation) {
      return NextResponse.json(
        { error: "Relationship already exists" },
        { status: 400 }
      );
    }

    // Create new mentor-client relationship
    const clientMentor = await prisma.clientMentor.create({
      data: {
        clientId,
        mentorId: session.mentorId,
        status: 'NEW'
      },
      include: {
        client: {
          include: {
            user: {
              select: {
                email: true,
                image: true
              }
            }
          }
        }
      }
    });

    // Create notification for client
    await prisma.notification.create({
      data: {
        title: "New Mentor Assignment",
        message: `${session.fullName} has been assigned as your mentor`,
        type: "MENTOR_RECOMMENDATION",
        mentorId: session.mentorId,
        clientId: clientId
      }
    });

    return NextResponse.json(clientMentor);
  } catch (error) {
    console.error("[POST Client] Error:", error);
    return NextResponse.json(
      { error: "Failed to create client relationship" },
      { status: 500 }
    );
  }
}

// Update client mentorship status
export async function PATCH(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { clientId, status } = await req.json();
    if (!clientId || !status) {
      return NextResponse.json(
        { error: "Client ID and status are required" },
        { status: 400 }
      );
    }

    const validStatuses = ['NEW', 'IN_PROGRESS', 'COMPLETED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    const updatedRelation = await prisma.clientMentor.update({
      where: {
        clientId_mentorId: {
          clientId,
          mentorId: session.mentorId
        }
      },
      data: { status },
      include: {
        client: true
      }
    });

    // Create notification for status change
    await prisma.notification.create({
      data: {
        title: "Mentorship Status Updated",
        message: `Your mentorship status has been updated to ${status}`,
        type: "MENTOR_RECOMMENDATION",
        mentorId: session.mentorId,
        clientId: clientId
      }
    });

    return NextResponse.json(updatedRelation);
  } catch (error) {
    console.error("[PATCH Client] Error:", error);
    return NextResponse.json(
      { error: "Failed to update client relationship" },
      { status: 500 }
    );
  }
}

// Remove client from mentor
export async function DELETE(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    // Delete the relationship
    await prisma.clientMentor.delete({
      where: {
        clientId_mentorId: {
          clientId,
          mentorId: session.mentorId
        }
      }
    });

    // Create notification for client
    await prisma.notification.create({
      data: {
        title: "Mentorship Ended",
        message: `Your mentorship with ${session.fullName} has ended`,
        type: "MENTOR_RECOMMENDATION",
        mentorId: session.mentorId,
        clientId: clientId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE Client] Error:", error);
    return NextResponse.json(
      { error: "Failed to remove client relationship" },
      { status: 500 }
    );
  }
}