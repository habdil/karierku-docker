// app/api/public/events/route.ts
import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Log untuk debugging
    console.log("Search Params:", Object.fromEntries(searchParams));

    // Default page size yang lebih besar
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const search = searchParams.get('search') || '';
    // Tampilkan semua event dulu untuk debug
    const showPast = true; // temporarily show all events

    const skip = (page - 1) * pageSize;

    // Sederhanakan where clause untuk debugging
    const where: Prisma.EventWhereInput = search 
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { location: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};

    // Log query params
    console.log("Query params:", { where, skip, take: pageSize });

    // Get total events first
    const totalEvents = await prisma.event.count({ where });
    console.log("Total events:", totalEvents);

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        date: 'desc' // tampilkan yang terbaru dulu
      },
      include: {
        admin: {
          select: {
            fullName: true
          }
        }
      },
      skip,
      take: pageSize
    });

    console.log("Fetched events count:", events.length);

    const totalPages = Math.ceil(totalEvents / pageSize);
    const pagination = {
      currentPage: page,
      totalPages,
      pageSize,
      totalEvents,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    };

    // Log pagination info
    console.log("Pagination:", pagination);

    return NextResponse.json({
      success: true,
      data: events,
      pagination
    });

  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch events" 
      }, 
      { status: 500 }
    );
  }
}