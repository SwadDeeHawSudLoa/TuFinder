import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    // Extract cookies from the request headers
    const cookieHeader = request.headers.get("cookie");
    const cookies = Object.fromEntries(cookieHeader?.split('; ').map(c => c.split('=')) || []);

    // Get user_id from the cookies
    const userId = cookies.user_id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Get the URL parameters from the request
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get("title") || undefined;
    const category = searchParams.get("category") || undefined;
    const location = searchParams.get("location") || undefined;
    const status = searchParams.get("status") || undefined;

    // Build the where clause dynamically based on the filters provided
    const whereClause: any = { userId };

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
    const posts = await prisma.post.findUnique({
        where: {
          userIdEdit: userId,
          ...whereClause // Spread the additional conditions
        }
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
