import DB from "@/app/lib/db"
import insertIntoVectorDB from "./insert"
import { embedder } from "@/app/lib/embedder"

export async function POST(request: Request) {
  const res = await request.json()

  const extraction = res.extraction
  const username = res.username

  if (!extraction) {
    return Response.json({ error: "No extraction provided" }, { status: 400 })
  } else if (!username) {
    return Response.json({ error: "No username provided" }, { status: 400 })
  }

  try {
    const vector = await embedder.embed(JSON.stringify(extraction))

    const vectorizationResult = await insertIntoVectorDB(vector, username)

    console.log(
      `Username: ${username} extraction got inserted into vector db\n${JSON.stringify(
        vectorizationResult,
        null,
        2
      )}`
    )

    const db = await DB.getInstance()

    db.data.profileExtractionToVector[username] = vector
    await db.write()

    return Response.json({ vector, vectorizationResult })
  } catch (error: any) {
    console.error(`Error inserting profile into vector db: ${error?.message}`)

    return Response.json({ error: error?.message }, { status: 500 })
  }
}
