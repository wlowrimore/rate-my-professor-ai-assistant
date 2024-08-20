from dotenv import load_dotenv
load_dotenv()
from pinecone import ServerlessSpec, Pinecone
from openai import OpenAI
import os
import json

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

pc.create_index(
  name="rag",
  dimension=1536,
  metric="cosine",
  spec=ServerlessSpec(cloud="aws", region="us-east-1"),
)

data = json.load(open("backend/reviews.json"))

processed_data = []
client = OpenAI()

for review in data["reviews"]:
    response = client.enbeddings.create(
      input=review['review'], model="text-embedding-3-small"
    )
    embedding = response.data[0].embedding
    processed_data.append(
      {
        "values": embedding,
        "id": review["professor"],
        "metadata":{
          "review": review["review"],
          "subject": review["subject"],
          "stars": review["stars"],
        }
      }
    )

    index = pc.Index("rag")
    upsert_response = index.upsert(
      vectors=processed_data,
      namespace="ns1",
    )
    print(f"Upserted count: {upsert_response['upserted_count']}")

    print(index.describe_index_stats())
