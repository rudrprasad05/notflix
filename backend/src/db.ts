import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function UploadVideoMetaToSql(
  url: string,
  image: string,
  name: string,
  duration: number
) {
  const newImage = await prisma.video.create({
    data: {
      url,
      image,
      name,
      duration,
    },
  });
  return newImage;
}

export async function GetAllMovies(skip: number, take: number) {
  const newImage = await prisma.video.findMany({
    skip,
    take,
  });
  return newImage;
}
