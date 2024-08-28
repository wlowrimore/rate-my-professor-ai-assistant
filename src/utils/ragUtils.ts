import { Pinecone, RecordMetadata } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || "",
});
const index = pc.index("rag");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function queryRAG(userQuery: string) {
  // Generates embedding for the user query
  const queryEmbedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: userQuery,
  });

  // Query Pinecone with the embedding
  const queryResponse = await index.query({
    vector: queryEmbedding.data[0].embedding,
    topK: 3,
    includeMetadata: true,
  });

  // Extracts relevant information from Pinecone results
  const contexts = queryResponse.matches
    .map((match) => {
      const metadata = match.metadata as RecordMetadata;
      return `Professor: ${metadata.professorName}
Subject: ${metadata.subject}
University: ${metadata.university}
Field of Study: ${metadata.fieldOfStudy}
Rating: ${metadata.rating}
Review: ${metadata.review}`;
    })
    .join("\n\n");

  // Constructs a prompt for OpenAI using the retrieved contexts
  const prompt = `Use the following professor information to answer the user's question. If the information is not directly relevant, say so.

Context:
${contexts}

User question: ${userQuery}

Answer:`;

  // Queries OpenAI with the constructed prompt
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  return completion.choices[0].message.content;
}
