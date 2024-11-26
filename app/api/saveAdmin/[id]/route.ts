import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminId = params.id;

  if (!adminId) {
    return NextResponse.json({ error: "Admin ID not found" }, { status: 400 });
  }

  const user = await prisma.admin.findUnique({
    where: {
      admin_id: adminId,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Admin not found" }, { status: 404 });
  }

  const name = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  return NextResponse.json({ name });
}
