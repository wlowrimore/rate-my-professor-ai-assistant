import { PrismaClient } from "@prisma/client";
import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";
import { NextResponse } from "next/server";

interface PineconeRecord<T> {
  id: string;
  values: number[];
  sparseValues: Record<string, number[]>;
  metadata: Record<string, string | number | boolean>;
}

interface Payload {
  id: string;
  values: number[];
  sparseValues: Record<string, number[]>;
  metadata: Record<string, string | number | boolean>;
}

interface Rating {
  id: string;
  stars: number;
  review: string;
}

const prisma = new PrismaClient();
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});
const index = pc.index("rag");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Vectorize the query using OpenAI
    const queryVector = await openai.embeddings.create({
      input: query,
      model: "text-embedding-ada-002",
    });

    // Query Pinecone for similar vectors
    const results = await index.query({
      vector: queryVector.data[0].embedding,
      topK: 3,
    });

    console.log("Results:", results);

    // Retrieve professor details from PostgreSQL based on the results
    const professorIds = results.matches
      .map((match) => {
        const id = parseInt(match.id, 10);
        return isNaN(id) ? undefined : id;
      })
      .filter((id): id is number => id !== undefined);
    const professors = await prisma.professor.findMany({
      where: {
        id: { in: professorIds },
      },
    });

    return NextResponse.json(professors);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
