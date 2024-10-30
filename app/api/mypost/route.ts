import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get user_id from the request query parameters
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get("user_id");

    // If user_id is provided, filter posts by user_id
    const posts = user_id
      ? await prisma.post.findMany({
          where: { userIdEdit: user_id },
        })
      : await prisma.post.findMany();

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    return NextResponse.json(
      { error: "Error retrieving posts" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
