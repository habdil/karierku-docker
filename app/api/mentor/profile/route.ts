// app/api/mentor/profile/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";
import { z } from "zod";

// Validation schema untuk update profile
const updateProfileSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap harus diisi").max(100, "Nama terlalu panjang"),
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit").max(15, "Nomor telepon maksimal 15 digit"),
  education: z.string().min(1, "Pendidikan harus diisi").max(200, "Pendidikan terlalu panjang"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED"]).optional(),
  company: z.string().min(1, "Nama perusahaan harus diisi").max(100, "Nama perusahaan terlalu panjang"),
  jobRole: z.string().min(1, "Jabatan harus diisi").max(100, "Jabatan terlalu panjang"),
  motivation: z.string().max(500, "Motivasi terlalu panjang").optional(),
});

export async function GET() {
  try {
    // Dapatkan session mentor
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ambil data mentor dengan relasi yang diperlukan
    const mentor = await prisma.mentor.findUnique({
      where: {
        id: session.mentorId,
      },
      include: {
        user: {
          select: {
            email: true,
            username: true,
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
          take: 5, // Ambil 5 konsultasi terakhir
        },
      },
    });

    if (!mentor) {
      return NextResponse.json(
        { success: false, error: "Mentor not found" },
        { status: 404 }
      );
    }

    // Hitung statistik mentor
    const stats = {
      totalConsultations: await prisma.consultation.count({
        where: { mentorId: session.mentorId },
      }),
      activeConsultations: await prisma.consultation.count({
        where: { mentorId: session.mentorId, status: "ACTIVE" },
      }),
      completedConsultations: await prisma.consultation.count({
        where: { mentorId: session.mentorId, status: "COMPLETED" },
      }),
      totalClients: await prisma.clientMentor.count({
        where: { mentorId: session.mentorId },
      }),
    };

    // Format response
    return NextResponse.json({
      success: true,
      data: {
        ...mentor,
        stats,
        // Remove sensitive information
        user: {
          email: mentor.user.email,
          username: mentor.user.username,
        },
      },
    });

  } catch (error) {
    console.error("[MENTOR_PROFILE_GET]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Verifikasi session
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse dan validasi body request
    const body = await request.json();
    const validationResult = updateProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    // Update profile mentor
    const updatedMentor = await prisma.mentor.update({
      where: {
        id: session.mentorId,
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
          },
        },
        expertise: true,
      },
    });

    // Get updated stats
    const stats = {
      totalConsultations: await prisma.consultation.count({
        where: { mentorId: session.mentorId },
      }),
      activeConsultations: await prisma.consultation.count({
        where: { mentorId: session.mentorId, status: "ACTIVE" },
      }),
      completedConsultations: await prisma.consultation.count({
        where: { mentorId: session.mentorId, status: "COMPLETED" },
      }),
      totalClients: await prisma.clientMentor.count({
        where: { mentorId: session.mentorId },
      }),
    };

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        ...updatedMentor,
        stats,
      },
    });

  } catch (error) {
    console.error("[MENTOR_PROFILE_UPDATE]", error);
    
    // Handle specific errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}