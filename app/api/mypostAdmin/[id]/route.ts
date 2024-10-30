import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const adminIdEdit = params.id;
  const posts = await prisma.post.findMany({
    where: {
      adminIdEdit: adminIdEdit,
    },
  });

  return Response.json(posts);
}
