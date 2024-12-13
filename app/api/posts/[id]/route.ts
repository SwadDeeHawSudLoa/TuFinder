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
    otherCategory ,
    image,
    imageAdmin,
    status,
    description,
    lat,
    long,
    location,
    markerText,locationINV 
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
      otherCategory ,
      image,
      imageAdmin,
      status,
      description,
      lat,
      long,
      location,
      markerText,
      locationINV ,
    },
  });
  return Response.json(updatePost);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const post_Id = Number(params.id);
  const deletePost = await prisma.post.delete({
    where: { post_id: post_Id },
  });

  return Response.json(deletePost);
}
