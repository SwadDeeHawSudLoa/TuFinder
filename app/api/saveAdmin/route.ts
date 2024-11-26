import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";

// Encrypt a value using AES encryption
const encryptWithCryptoJS = (value: string, secretKey: string): string => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};
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

    // Encrypt the user_id and set it in a cookie
    const encryptedUserId = encryptWithCryptoJS(admin_id, SECRET_KEY);
    response.cookies.set("user_id", encryptedUserId);

    return response;
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Error saving admin" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  const user = await prisma.admin.findFirst();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  return NextResponse.json(name);





}