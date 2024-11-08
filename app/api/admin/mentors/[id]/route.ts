// app/api/mentor/[id]/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { z } from "zod";

// Validasi schema untuk update mentor
const updateMentorSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit"),
  education: z.string().min(1, "Pendidikan harus diisi"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED"]).optional(),
  company: z.string().min(1, "Nama perusahaan harus diisi"),
  jobRole: z.string().min(1, "Jabatan harus diisi"),
  motivation: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

// GET mentor by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifikasi admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const mentor = await prisma.mentor.findUnique({
      where: {
        id: params.id,
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            role: true,
          },
        },
        expertise: true,
        consultations: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            client: {
              select: {
                fullName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    // Hitung statistik
    const stats = {
      totalConsultations: await prisma.consultation.count({
        where: { mentorId: params.id }
      }),
      activeConsultations: await prisma.consultation.count({
        where: { 
          mentorId: params.id,
          status: "ACTIVE"
        }
      }),
      completedConsultations: await prisma.consultation.count({
        where: { 
          mentorId: params.id,
          status: "COMPLETED"
        }
      }),
    };

    return NextResponse.json({
      success: true,
      data: {
        ...mentor,
        stats
      },
    });

  } catch (error) {
    console.error("[GET_MENTOR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch mentor" },
      { status: 500 }
    );
  }
}

// UPDATE mentor
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifikasi admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validasi input
    const validationResult = updateMentorSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    // Update mentor
    const updatedMentor = await prisma.mentor.update({
      where: {
        id: params.id,
      },
      data: {
        ...validationResult.data,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
            role: true,
          },
        },
        expertise: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Mentor updated successfully",
      data: updatedMentor,
    });

  } catch (error) {
    console.error("[UPDATE_MENTOR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update mentor" },
      { status: 500 }
    );
  }
}

// DELETE mentor
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verifikasi admin session
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get mentor to find userId
    const mentor = await prisma.mentor.findUnique({
      where: {
        id: params.id,
      },
      select: {
        userId: true,
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    // Delete mentor and associated user using transaction
    await prisma.$transaction([
      // Delete mentor's expertise
      prisma.mentorExpertise.deleteMany({
        where: { mentorId: params.id },
      }),
      // Delete mentor's notifications
      prisma.notification.deleteMany({
        where: { mentorId: params.id },
      }),
      // Delete mentor's consultations
      prisma.consultation.deleteMany({
        where: { mentorId: params.id },
      }),
      // Delete mentor's client relations
      prisma.clientMentor.deleteMany({
        where: { mentorId: params.id },
      }),
      // Delete mentor
      prisma.mentor.delete({
        where: { id: params.id },
      }),
      // Finally delete user
      prisma.user.delete({
        where: { id: mentor.userId },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "Mentor deleted successfully",
    });

  } catch (error) {
    console.error("[DELETE_MENTOR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete mentor" },
      { status: 500 }
    );
  }
}