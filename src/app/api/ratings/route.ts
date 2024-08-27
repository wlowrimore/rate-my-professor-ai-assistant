import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { fetchAndVectorizeData } from "@/utils/vectorizeData";

const prisma = new PrismaClient();

export async function GET(request: any, response: any) {
  const professors = await prisma.professor.findMany();
  return NextResponse.json({ professors });
}

export async function POST(request: any, response: any) {
  const rawBody = await request.text();
  const body = await JSON.parse(rawBody);
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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
      where: { email: session?.user?.email || "" },
      create: {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
      },
      update: {},
    });

    // Create or retrieve the professor
    let professor;
    let professorId;

    if (professorName) {
      professor = await prisma.professor
        .findUnique({
          where: { name: professorName },
        })
        .then((professor) => professor);

      if (!professor) {
        professor = await prisma.professor.create({
          data: {
            name: professorName,
            fieldOfStudy: fieldOfStudy,
            university: universityName,
            subject: body.subject,
            Rating: {
              create: {
                review: review,
                rating: rating,
                user: { connect: { email: user.email } },
              },
            },
          },
        });
      }
      professorId = professor.id;
    } else {
      console.log("No professor name provided");
      return NextResponse.json(
        { message: "No professor name provided" },
        { status: 400 }
      );
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
