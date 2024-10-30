import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  // Extract cookies from the request
  const cookies = request.headers.get("cookie");
  const userIdCookie = cookies
    ?.split("; ")
    .find((row) => row.startsWith("user_id="));
  const userId = userIdCookie ? userIdCookie.split("=")[1] : params.id;

  if (!userId) {
    return NextResponse.json({ error: "User ID not found" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: {
      user_id: userId,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const name = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  return NextResponse.json(name);
}
