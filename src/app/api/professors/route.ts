import { PrismaClient } from "@prisma/client";
import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";

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

export async function searchProfessors(query: number[]) {
  // Vectorize the query using OpenAI
  const queryVector = await openai.embeddings.create({
    input: query,
    model: "text-embedding-ada-002",
  });

  // Query Pinecone for similar vectors
  const results = await pc.Index("rag").query({
    vector: queryVector.data[0].embedding,
    topK: 3,
  });
  console.log("Results:", results);

  // Retrieve professor details from PostgreSQL based on the results
  const professorIds = Array.isArray(results)
    ? results.map((result: any) => result.id)
    : [];
  const professors = await prisma.professor.findMany({
    where: {
      id: { in: professorIds },
    },
  });

  return professors;
}
