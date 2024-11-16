import DB from "@/app/lib/db"
import insertIntoVectorDB from "./insert"

export async function POST(request: Request) {
  const res = await request.json()

  const extraction = res.extraction
  const username = res.username

  console.log("extraction", extraction)

  if (!extraction) {
    return Response.json({ error: "No extraction provided" }, { status: 400 })
  } else if (!username) {
    return Response.json({ error: "No username provided" }, { status: 400 })
  }

  return Response.json({ error: "NOT IMPLEMENTED" }, { status: 400 })

  try {
    const vectorization = await insertIntoVectorDB(extraction)

    console.log(
      `Username: ${username} extraction got inserted into vector db\n${vectorization}`
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
