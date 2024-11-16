import DB from "@/app/lib/db"
import { COLLECTION_NAME, milvus } from "@/app/lib/milvus"

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
    const result = await milvus.query({
      collection_name: COLLECTION_NAME,
      expr: `vector >= ${vectorization}`,
      output_fields: ["vector", "name"],
      limit: 10,
    })

    console.log(
      `Username: ${username} extraction got queried in the vector db\n${JSON.stringify(
        result,
        null,
        2
      )}`
    )

    const db = await DB.getInstance()

    db.data.profileExtractionToVector[username] = vectorization
    await db.write()

    return Response.json(vectorization)
  } catch (error: any) {
    console.error(`Error inserting profile into vector db: ${error?.message}`)

    return Response.json({ error: error?.message }, { status: 500 })
  }
}
