import DB from "@/app/lib/db"
import { createProfileExtraction } from "./extract"

export async function POST(request: Request) {
  const res = await request.json()

  const profile = res.profile
  const username = res.username

  if (!profile) {
    return Response.json({ error: "No profile provided" }, { status: 400 })
  } else if (!username) {
    return Response.json({ error: "No username provided" }, { status: 400 })
  }

  try {
    const extraction = await createProfileExtraction(profile)

    console.log(`Profile: ${profile} got extracted to\n${extraction}`)

    const db = await DB.getInstance()

    db.data.usernameToProfileExtraction[username] = {
      profile,
      extraction,
    }
    await db.write()

    return Response.json(extraction)
  } catch (error: any) {
    console.error(`Error creating profile extraction: ${error?.message}`)

    return Response.json({ error: error?.message }, { status: 500 })
  }
}
