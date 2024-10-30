import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    // Get the URL parameters from the request
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get("title") || undefined;
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;
    const status = searchParams.get("status") || undefined;

    // Build the where clause dynamically based on the filters provided
    const whereClause: any = {};

    if (title) {
      whereClause.title = { contains: title };
    }

    if (category) {
      whereClause.category = category;
    }

    if (location) {
      whereClause.location = location;
    }

    if (status) {
      whereClause.status = status;
    }

    // Fetch posts with dynamic filtering
    const posts = await prisma.post.findMany({
      where: whereClause,
    });

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
