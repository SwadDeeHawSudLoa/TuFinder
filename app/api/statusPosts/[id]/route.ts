import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: number } }, // Make sure the id type is number
) {
  const { status } = await request.json();

  const post_Id = Number(params.id); // Convert to a number if necessary

  const updatePost = await prisma.post.update({
    where: { post_id: post_Id }, // Ensure this matches the type in your schema
    data: {
      status,
    },
  });

  return new Response(JSON.stringify(updatePost)); // Correct the Response handling
}
