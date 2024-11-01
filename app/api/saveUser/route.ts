import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Retrieve all users from the database
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { error: "Error retrieving users" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { user_id, first_name, last_name ,tel} = await request.json();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { user_id },
    });

    let response;

    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { user_id },
        data: { first_name, last_name },
      });

      response = NextResponse.json(updatedUser);
    } else {
      // Create a new user
      const newUser = await prisma.user.create({
        data: { user_id, first_name, last_name ,tel},
      });

      response = NextResponse.json(newUser);
    }

    // Set a cookie for the user
    response.cookies.set("user_id", user_id);

    return response;
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Error saving user" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
