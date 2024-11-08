// app/api/avatar/[mentorId]/route.ts
import { NextResponse } from "next/server";
import  prisma  from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { mentorId: string } }
) {
  try {
    // Verifikasi session (bisa admin, mentor, atau client)
    const session = await getCurrentSession();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const mentor = await prisma.mentor.findUnique({
      where: {
        id: params.mentorId,
      },
      select: {
        fullName: true,
      },
    });

    if (!mentor) {
      return new NextResponse("Mentor not found", { status: 404 });
    }

    // Generate avatar URL using DiceBear API
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      mentor.fullName
    )}`;

    // Fetch avatar from DiceBear
    const response = await fetch(avatarUrl);
    const svg = await response.text();

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400", // Cache selama 24 jam
      },
    });
  } catch (error) {
    console.error("[MENTOR_AVATAR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
