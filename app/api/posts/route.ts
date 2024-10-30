import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const posts = await prisma.post.findMany();
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

export async function POST(request: Request) {
  try {
    const {
      userIdEdit,
      adminIdEdit,
      title,
      username,
      tel,
      category,
      image,
      status,
      description,
      lat,
      long,
      location,
    } = await request.json();

    // Create a new post, Prisma will automatically handle post_id
    const newPost = await prisma.post.create({
      data: {
        userIdEdit: userIdEdit,
        adminIdEdit,
        title,
        username,
        tel,
        category,
        image,
        status,
        description,
        lat,
        long,
        location,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    console.error("Error saving post:", error);
    return NextResponse.json({ error: "Error saving post" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
