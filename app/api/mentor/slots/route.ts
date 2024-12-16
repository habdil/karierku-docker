// app/api/mentor/slots/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMentorSession } from "@/lib/auth";

// GET: Mengambil semua slot konsultasi mentor
export async function GET(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const slots = await prisma.consultationSlot.findMany({
      where: {
        mentorId: session.mentorId,
        startTime: {
          gte: new Date(), // Hanya ambil slot yang belum lewat
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(slots);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Menambahkan slot konsultasi baru
export async function POST(req: Request) {
  try {
    const session = await getMentorSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, startTime, duration, isRecurring, recurringDays } = await req.json();

    // Buat objek Date dari kombinasi tanggal dan waktu
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0, 0);

    // Hitung waktu selesai
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);

    if (isRecurring && recurringDays.length > 0) {
      // Buat slot berulang untuk 4 minggu ke depan
      const slots = [];
      for (let week = 0; week < 4; week++) {
        for (const day of recurringDays) {
          const slotStart = new Date(startDate);
          slotStart.setDate(slotStart.getDate() + (week * 7) + day);

          const slotEnd = new Date(endDate);
          slotEnd.setDate(slotEnd.getDate() + (week * 7) + day);

          slots.push({
            mentorId: session.mentorId,
            startTime: slotStart,
            endTime: slotEnd,
            duration,
            isBooked: false,
            isRecurring: true,
            recurringDays,
            maxBookings: 1,
          });
        }
      }

      const createdSlots = await prisma.consultationSlot.createMany({
        data: slots,
      });

      return NextResponse.json(createdSlots);
    } else {
      // Buat single slot
      const slot = await prisma.consultationSlot.create({
        data: {
          mentorId: session.mentorId,
          startTime: startDate,
          endTime: endDate,
          duration,
          isBooked: false,
          isRecurring: false,
          maxBookings: 1,
        },
      });

      return NextResponse.json(slot);
    }
  } catch (error) {
    console.error("Error creating slot:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}