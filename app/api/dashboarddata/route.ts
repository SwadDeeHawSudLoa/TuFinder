import { NextResponse } from "next/server"; 
import prisma from "../../lib/prisma"; // Check the path is correct

export async function GET() {
  try {
    // Count total posts
    const totalPosts = await prisma.post.count();

    // Count total users
    const totalUsers = await prisma.user.count();

    // Count total admins
    const totalAdmins = await prisma.admin.count();

    // Count statuses
    const statusCountInStock = await prisma.post.count({
      where: { status: "สถานะอยู่ในคลัง" },
    });

    const statusCountNotInStock = await prisma.post.count({
      where: { status: "สถานะไม่อยู่ในคลัง" },
    });

    const statusCountReceived = await prisma.post.count({
      where: { status: "สถานะถูกรับไปเเล้ว" },
    });

    // Fetch recent 4 posts
    const recentPosts = await prisma.post.findMany({
      orderBy: {
        date: "desc",
      },
      take: 4,
    });

    // Fetch all posts
    const allPosts = await prisma.post.findMany({
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      totalPosts,
      totalUsers,
      totalAdmins,
      statusCountInStock,
      statusCountNotInStock,
      statusCountReceived,
      recentPosts,
      allPosts,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
