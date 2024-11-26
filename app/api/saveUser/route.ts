import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import CryptoJS from "crypto-js";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "your-secret-key";

// Encrypt a value using AES encryption
const encryptWithCryptoJS = (value: string, secretKey: string): string => {
  return CryptoJS.AES.encrypt(value, secretKey).toString();
};

// Decrypt a value using AES decryption
const decryptWithCryptoJS = (encryptedValue: string, secretKey: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
};

// Hash the user ID (optional for additional security)
function hashUserId(userId: string): string {
  return CryptoJS.HmacSHA256(userId, SECRET_KEY).toString(CryptoJS.enc.Hex);
}

export async function GET(request: Request) {
  try {
    // Retrieve all users from the database
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    return NextResponse.json(
      { error: "Error retrieving users" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { user_id, first_name, last_name } = await request.json();

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
        data: { user_id, first_name, last_name },
      });

      response = NextResponse.json(newUser);
    }

    // Encrypt the user_id and set it in a cookie
    const encryptedUserId = encryptWithCryptoJS(user_id, SECRET_KEY);
    response.cookies.set("user_id", encryptedUserId);

    return response;
  } catch (error) {
    console.error("Error saving user:", error);
    return NextResponse.json({ error: "Error saving user" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}