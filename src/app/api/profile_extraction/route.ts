import DB from "@/app/lib/db"
import axios from "axios"
import { createProfileExtraction } from "./extract"
import { embedder } from "@/app/lib/embedder"

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

    const url = new URL(request.url)
    const vector = await embedder.embed(JSON.stringify(extraction))

    const responseSearch = await axios.post(
      `${url.protocol}//${url.host}/api/vectorize/search`,
      {
        username,
        vectorization: vector.values,
      }
    )

    if (responseSearch.status !== 200) {
      throw new Error(
        `Error calling vectorize/insert API: ${responseSearch.statusText} ${responseSearch.status}`
      )
    }

    const responseInsert = await axios.post(
      `${url.protocol}//${url.host}/api/vectorize/insert`,
      {
        username,
        extraction,
      }
    )
    if (responseInsert.status !== 200) {
      throw new Error(
        `Error calling vectorize/insert API: ${responseInsert.statusText} ${responseInsert.status}`
      )
    }

    const vectorization = responseInsert.data

    return Response.json({
      extraction,
      vectorizationResult: vectorization.vectorizationResult,
      results: responseSearch.data?.results.filter((r: any) => r.name !== username),
    })
  } catch (error: any) {
    console.error(`Error creating profile extraction: ${error?.message}`)

    return Response.json({ error: error?.message }, { status: 500 })
  }
}
