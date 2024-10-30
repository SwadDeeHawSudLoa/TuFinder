import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; // หรือเส้นทางที่ถูกต้อง

export async function GET() {
  try {
    // นับจำนวนโพสต์ทั้งหมด
    const totalPosts = await prisma.post.count();

    // นับจำนวนผู้ใช้งานทั้งหมด
    const totalUsers = await prisma.user.count();

    // นับจำนวนแอดมินทั้งหมด
    const totalAdmins = await prisma.admin.count();

    // นับจำนวน status แยกตามประเภท
    const statusCountInStock = await prisma.post.count({
      where: { status: 'สถานะอยู่ในคลัง' },
    });

    const statusCountNotInStock = await prisma.post.count({
      where: { status: 'สถานะไม่อยู่ในคลัง' },
    });

    const statusCountReceived = await prisma.post.count({
      where: { status: 'สถานะถูกรับไปเเล้ว' },
    });

    // Fetch recent 4 posts (รายการล่าสุด 4 โพสต์)
    const recentPosts = await prisma.post.findMany({
      orderBy: {
        date: 'desc', // เรียงตามวันที่จากใหม่ไปเก่า
      },
      take: 4, // จำนวนโพสต์ล่าสุดที่ต้องการดึง
    });

    // Fetch all posts (ดึงโพสต์ทั้งหมด)
    const allPosts = await prisma.post.findMany({
      orderBy: {
        date: 'desc', // เรียงตามวันที่จากใหม่ไปเก่า
      },
    });

    return NextResponse.json({
      totalPosts,
      totalUsers,
      totalAdmins,
      statusCountInStock,
      statusCountNotInStock,
      statusCountReceived,
      recentPosts, // ส่ง recentPosts กลับไปด้วย
      allPosts,    // ส่ง allPosts กลับไปด้วย
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching dashboard data' }, { status: 500 });
  }
}
