import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
  You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
  For every user question, the top 3 professors that match the user question are returned with their ratings.
  Use the provided professor information to answer the question accurately. If the information is not directly relevant, say so.
`;

export async function POST(req: any) {
  const data = await req.json();

  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });
  const index = pc.index("rag");
  const openai = new OpenAI();

  const userQuery = data[data.length - 1].content as string;

  // Generate embedding for user query
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: userQuery,
    encoding_format: "float",
  });

  // Query Pinecone with the embedding
  const results = await index.query({
    vector: embedding.data[0].embedding,
    topK: 5,
    includeMetadata: true,
  });

  // Format retrieved information
  let contextString = "Relevant Professor Information:\n";
  results.matches.forEach((match) => {
    contextString += `
    Professor: ${match.metadata?.professorName || match.id}
    Subject: ${match.metadata?.subject}
    University: ${match.metadata?.universityName}
    Field of Study: ${match.metadata?.fieldOfStudy}
    Rating: ${match.metadata?.rating}
    Review: ${match.metadata?.review}
    \n
    `;
  });
  console.log("Results:", results);

  // Construct messages for OpenAI, including context
  const messages = [
    { role: "system", content: systemPrompt },
    ...data.slice(0, -1), // Include previous conversation
    { role: "user", content: contextString }, // Add retrieved context
    { role: "user", content: userQuery }, // Add the user's query
  ];

  const completion = await openai.chat.completions.create({
    messages: messages,
    model: "gpt-4o-mini",
    stream: true,
  });

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });
  return new NextResponse(stream);
}
