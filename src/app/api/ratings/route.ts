import { PrismaClient, Professor, User, Rating } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { fetchAndVectorizeData } from "@/utils/vectorizeData";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const professors = await prisma.professor.findMany();
  return NextResponse.json({ professors });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      rating,
      review,
      professorName,
      fieldOfStudy,
      universityName,
      subject,
    } = body;

    console.log("Body: ", body);

    // Create or retrieve the user
    const user = await prisma.user.upsert({
      where: { email: session.user?.email || "" },
      create: {
        name: session.user?.name || "",
        email: session.user?.email || "",
      },
      update: {},
    });

    // Create or retrieve the professor
    if (!professorName) {
      console.log("No professor name provided");
      return NextResponse.json(
        { message: "No professor name provided" },
        { status: 400 }
      );
    }

    let professor: Professor | null = await prisma.professor.findUnique({
      where: { name: professorName },
    });

    if (!professor) {
      professor = await prisma.professor.create({
        data: {
          name: professorName,
          fieldOfStudy,
          university: universityName,
          subject,
          Rating: {
            create: {
              review,
              rating,
              user: { connect: { email: user.email } },
            },
          },
        },
      });
    }

    const newRating = await prisma.rating.create({
      data: {
        userId: user.id,
        professorId: professor.id,
        rating,
        review,
      },
    });

    try {
      await fetchAndVectorizeData();
      console.log("Vectorization completed");
    } catch (error) {
      console.error("Error during vectorization:", error);
    }

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
