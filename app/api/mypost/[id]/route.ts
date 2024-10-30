import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const userIdEdit = params.id;
  const posts = await prisma.post.findMany({
    where: {
      userIdEdit: userIdEdit,
    },
  });

  return Response.json(posts);
}
