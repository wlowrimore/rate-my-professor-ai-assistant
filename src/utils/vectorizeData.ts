import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";

interface VectorData {
  id: string;
  values: number[];
  metadata: {
    professorName: string;
    subject: string;
    university: string;
    fieldOfStudy: string;
    rating: number;
    review: string;
  };
}

const prisma = new PrismaClient();
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});
const index = pc.index("rag");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function fetchAndVectorizeData() {
  const professors = await prisma.professor.findMany({
    include: {
      Rating: true,
    },
  });
  console.log(`Found ${professors.length} professors in the database`);

  const vectors = await Promise.all(
    professors.map(async (professor) => {
      try {
        const vectorResponse = await openai.embeddings.create({
          model: "text-embedding-ada-002",
          input: `${professor.name} ${professor.subject} ${professor.university} ${professor.fieldOfStudy}`,
        });

        if (!vectorResponse.data || !vectorResponse.data[0]) {
          console.error("Missing data in OpenAI response");
          return null;
        }

        const embedding = vectorResponse.data[0].embedding;
        console.log("Vector dimension:", embedding.length);

        if (embedding.length !== 1536) {
          console.error(
            `Vector dimension mismatch. Expected 1536, got ${embedding.length}`
          );
          return null;
        }

        console.log(
          "Pinecone API Key:",
          process.env.PINECONE_API_KEY?.slice(0, 5) + "..."
        );
        console.log("Pinecone Index Name:", "rag");

        return {
          id: professor.id.toString(),
          values: embedding,
          metadata: {
            professorName: professor.name,
            subject: professor.subject,
            university: professor.university,
            fieldOfStudy: professor.fieldOfStudy,
            rating: professor.Rating?.[0]?.rating || 0,
            review: professor.Rating?.[0]?.review || "",
          },
        };
      } catch (error) {
        console.error("Error generating vector:", error);
        return null;
      }
    })
  );

  const validVectors = vectors.filter((v): v is VectorData => v !== null);

  if (validVectors.length === 0) {
    console.error("No valid vectors to upsert");
    return;
  }

  try {
    await index.upsert(validVectors);
    console.log(`Successfully upserted ${validVectors.length} vectors`);

    const verifyResult = await index.fetch([validVectors[0].id]);
    console.log(`Verified vector: ${JSON.stringify(verifyResult)}`);
  } catch (error) {
    console.error("Error upserting vectors to Pinecone:", error);
    console.error("Error details:", JSON.stringify(error, null, 2));
  }
}
