import { PrismaClient } from "@prisma/client";
import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";

interface PineconeRecord<T> {
  id: string;
  values: number[];
  metadata: Record<string, string | number | boolean>;
}

interface Payload {
  vectors: PineconeRecord<RecordMetadata>[];
  namespace: string;
  batch_size: number;
  top_k: number;
  include_values: boolean;
  include_metadata: boolean;
}

const prisma = new PrismaClient();
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});

async function fetchAndVectorizeData() {
  const professors = await prisma.professor.findMany({
    include: {
      Rating: true,
    },
  });

  const vectors: any = professors.map(async (professor) => {
    const openai = new OpenAI();
    const vector = openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: `${professor.name} ${professor.subject} ${professor.university} ${professor.fieldOfStudy}`,
    });
    return {
      id: professor.id.toString(),
      values: (await vector).data[0].embedding,
      metadata: {
        professorName: professor.name,
        subject: professor.subject,
        university: professor.university,
        fieldOfStudy: professor.fieldOfStudy,
        rating: professor.Rating,
      },
    };
  });
  const payload: Payload = {
    vectors: await Promise.all(vectors),
    namespace: "ns1",
    batch_size: 100,
    top_k: 3,
    include_values: true,
    include_metadata: true,
  };

  await pc.Index("rag").upsert(payload as any);
}

fetchAndVectorizeData();
