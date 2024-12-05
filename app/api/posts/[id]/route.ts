import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const post_Id = Number(params.id);
  const post = await prisma.post.findUnique({
    where: {
      post_id: post_Id,
    },
  });

  return Response.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const {
    userIdEdit,
    adminIdEdit,
    title,
    username,
    tel,
    teluser,
    category,
    image,
    imageAdmin,
    status,
    description,
    lat,
    long,
    location,
  } = await request.json();
  const post_Id = Number(params.id);
  const updatePost = await prisma.post.update({
    where: { post_id: post_Id },
    data: {
      userIdEdit,
      adminIdEdit,
      title,
      username,
      tel,
      teluser,
      category,
      image,
      imageAdmin,
      status,
      description,
      lat,
      long,
      location,
    },
  });
  return Response.json(updatePost);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const post_Id = Number(params.id);
    const deletePost = await prisma.post.delete({
      where: { post_id: post_Id },
      select: {
        post_id: true,
        title: true,
        username: true,
        adminusername: true,
        category: true,
        status: true,
        description: true,
      }
    });

    return new Response(JSON.stringify(deletePost), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error deleting post" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } finally {
    await prisma.$disconnect();
  }
}
