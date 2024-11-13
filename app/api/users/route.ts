//api นับ จำนวน users และ post
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        user_id: true,
        first_name: true,
        last_name: true,
        _count: {
          select: { 
            Post: true 
          }
        }
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
