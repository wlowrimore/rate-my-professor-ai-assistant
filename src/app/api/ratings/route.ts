import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export default async function GET(request: Request, response: Response) {
  const professors = await prisma.professor.findMany();
  return NextResponse.json({ professors });
}

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { rating, review, professorName, fieldOfStudy, universityName } =
      body;

    // Create or retrieve the user
    const user = await prisma.user.upsert({
      where: { email: session?.user?.email || "" },
      create: {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
      },
      update: {},
    });

    // Create or retrieve the professor
    const professor = await prisma.professor.upsert({
      where: { name: professorName },
      create: {
        name: professorName,
        university: universityName,
        fieldOfStudy: fieldOfStudy,
        subject: body.subject,
        Rating: {
          create: {
            rating,
            review,
            user: {
              connect: { id: user.id },
            },
          },
        },
      } as any,
      update: {},
    });

    // Create the rating
    const newRating = await prisma.rating.create({
      data: {
        userId: user.id,
        professorId: professor.id,
        rating,
        review,
      },
    });

    return NextResponse.json({
      message: "Rating created successfully!",
      data: newRating,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating rating" },
      { status: 500 }
    );
  }
}
