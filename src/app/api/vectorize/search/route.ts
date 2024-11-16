import DB from "@/app/lib/db"
import { COLLECTION_NAME, milvus } from "@/app/lib/milvus"
import { SearchReq, SearchSimpleReq } from "@zilliz/milvus2-sdk-node"

export async function POST(request: Request) {
  const res = await request.json()

  const vectorization = res.vectorization
  const username = res.username

  if (!vectorization) {
    return Response.json(
      { error: "No vectorization provided" },
      { status: 400 }
    )
  } else if (!username) {
    return Response.json({ error: "No username provided" }, { status: 400 })
  }

  try {
    const result = await milvus.search({
      collection_name: COLLECTION_NAME,
      anns_field: "vector", // Field in schema storing vectors
      vector: vectorization,
      output_fields: ["name"], // Fields to include in results
      limit: 10, // Limit for the number of results
      topk: 10,
      params: { nprobe: 10 }, // Additional search params
      metric_type: "COSINE", // Distance metric: "L2", "IP", or "COSINE"
    } as SearchSimpleReq)

    console.log(
      `Username: ${username} extraction got queried in the vector db\n${JSON.stringify(
        result,
        null,
        2
      )}`
    )

    return Response.json(result)
  } catch (error: any) {
    console.error(`Error inserting profile into vector db: ${error?.message}`)

    return Response.json({ error: error?.message }, { status: 500 })
  }
}
