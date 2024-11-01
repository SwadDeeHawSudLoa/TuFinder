import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { admin_id, first_name, last_name } = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.admin.findUnique({
      where: { admin_id },
    });

    let response;

    if (existingUser) {
      // Update existing admin
      const updatedAdmin = await prisma.admin.update({
        where: { admin_id },
        data: { first_name, last_name },
      });

      response = NextResponse.json(updatedAdmin);
    } else {
      // Create a new admin
      const newAdmin = await prisma.admin.create({
        data: { admin_id, first_name, last_name },
      });

      response = NextResponse.json(newAdmin);
    }

    // Set a cookie for the admin
    response.cookies.set("user_id", admin_id);

    return response;
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Error saving admin" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

