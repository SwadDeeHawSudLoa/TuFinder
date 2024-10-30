import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Force dynamic rendering
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Get user_id from the request query parameters
  const { searchParams } = new URL(request.url);
  const user_id = searchParams.get("user_id");

  // If user_id is provided, filter posts by user_id
  const posts = user_id
    ? await prisma.post.findMany({
        where: { userIdEdit: user_id },
      })
    : await prisma.post.findMany();

  await prisma.$disconnect();
  return NextResponse.json(posts);
}
