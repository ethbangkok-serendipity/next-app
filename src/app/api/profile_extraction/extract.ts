import { JsonOutputParser } from "@langchain/core/output_parsers"
import { VertexAI } from "@langchain/google-vertexai"
import { OutputFixingParser } from "langchain/output_parsers"
import promptTemplate from "./prompt"

const llm = new VertexAI({
  model: "gemini-1.5-pro-002",
  temperature: 1.0,
  maxOutputTokens: 8192,
})

const parser = new JsonOutputParser()

const parserWithFix = OutputFixingParser.fromLLM(llm, parser)

export function createVertexAIChain() {
  const chain = promptTemplate.pipe(llm).pipe(parserWithFix)

  return chain
}

export async function createProfileExtraction(profile: string) {
  const chain = createVertexAIChain()

  const result = await chain.invoke({ twitter_profile: profile })

  return result
}

// ;(async () => {
//   const profile = `
//   👷 building @datalatte
//    to democratize 📊 data & 🤖 AI
//   👨‍💻 fullstack engineer UI, backend, contracts, data pipelines,
//   ✈️ traveling mostly between 🇩🇪 and 🇹🇭
//   `

//   const result = await createProfileExtraction(profile)

//   console.log("result", JSON.stringify(result, null, 2))
// })()
