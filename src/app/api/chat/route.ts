import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const systemPrompt = `
  You are a Rate My Professor agent designed to help students find classes. Your task is to answer user questions about professors and courses.

For every user question, you must:
1. Identify the relevant university and subject from the query.
2. Return information about the top 3 professors that match the user's subject, university, reviews, and ratings.
3. Include each professor's name, subject, university, review and their rating.
4. If there are 3 or more ratings for professors on the same subject, return the top 3. If there are fewer than 3 professors with that subject at that university, return information for the top 3 available professors.

Use the provided professor, university, and subject information to answer questions accurately. If the requested subject, university and rating is not available, clearly state this fact.

Always strive to return 3 professors unless there is a clear reason not to do so.  
`;

function preprocessQuery(userQuery: string) {
  userQuery = "Who are the top professors for Computer Science at MIT?";
  const universityRegex =
    /(MIT|Harvard|Stanford|Yale|Princeton|Columbia|Oxford|Cambridge|University of Pennsylvania|University of Chicago)/i;
  const subjectRegex =
    /(Computer Science|Computer Engineering|Computer Science and Engineering|Software Engineering|Data Science)/i;

  const universityMatch = userQuery.match(universityRegex);
  const subjectMatch = userQuery.match(subjectRegex);

  let university = universityMatch ? universityMatch[0] : "";
  let subject = subjectMatch ? subjectMatch[0] : "";

  // If university or subject is not found, try extracting from the beginning of the query
  if (!university) {
    university = userQuery.split(" ")[0];
  }
  if (!subject) {
    subject = userQuery.split(" ")[1];
  }

  const enhancedQuery = `Based on the provided information, list the top 3 professors for ${subject} at ${university}. For each professor, provide their name and rating. If there are fewer than 3 professors available, list all that are available and explain why there aren't 3.`;

  return enhancedQuery;
}

export async function POST(req: any) {
  console.log("Received Post Request");
  try {
    const data = await req.json();
    console.log("Received data:", data);

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as string,
    });
    const index = pc.index("rag");
    const openai = new OpenAI();

    const userQuery = data[data.length - 1].content as string;
    console.log("User query:", userQuery);

    // Generate embedding for user query
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: userQuery,
      encoding_format: "float",
    });

    // Query Pinecone with the embedding
    console.log("Querying Pinecone");
    const results = await index.query({
      vector: embedding.data[0].embedding,
      topK: 3,
      includeMetadata: true,
    });

    // Format retrieved information
    let contextString = "Relevant Professor Information:\n";
    results.matches.forEach((match) => {
      contextString += `
      Professor: ${match.metadata?.professorName || match.id}
      Subject: ${match.metadata?.subject}
      University: ${match.metadata?.university}
      Field of Study: ${match.metadata?.fieldOfStudy}
      Rating: ${match.metadata?.rating}
      Review: ${match.metadata?.review}
      \n
      `;
    });
    console.log("Context String:", contextString);

    // Construct messages for OpenAI, including context
    const messages = [
      { role: "system", content: systemPrompt },
      ...data.slice(0, -1), // Include previous conversation
      { role: "user", content: contextString }, // Add retrieved context
      { role: "user", content: userQuery }, // Add the user's query
    ];

    console.log("Sending request to OpenAI");
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
            const content = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(encoder.encode(content));
          }
        } catch (err) {
          console.log("Error in stream processing:", err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    console.log("Returning stram response");
    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
