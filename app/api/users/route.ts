// app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma' ; // ปรับเส้นทางให้ตรงกับตำแหน่งจริงของ prisma instance

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        Post: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.error();
  }
}
