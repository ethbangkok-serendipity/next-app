import { VertexAI } from "@langchain/google-vertexai"
import promptTemplate from "./prompt"
import { JsonOutputParser } from "@langchain/core/output_parsers"

export function createVertexAIChain() {
  const llm = new VertexAI({
    model: "gemini-1.5-pro-001",
    temperature: 1.0,
    maxOutputTokens: 8192,
  })

  const parser = new JsonOutputParser()

  const chain = promptTemplate.pipe(llm).pipe(parser)
  // const parserWithFix = OutputFixingParser.fromLLM(llm, parser)
  // await parserWithFix.parse(misformatted)

  return chain
}

export async function createProfileExtraction(
  profile: string
): Promise<Record<string, any>> {
  const chain = createVertexAIChain()

  const result = await chain.invoke({ twitter_profile: profile })

  return result
}

;(async () => {
  const profile = `
  👷 building @datalatte
   to democratize 📊 data & 🤖 AI
  👨‍💻 fullstack engineer UI, backend, contracts, data pipelines,
  ✈️ traveling mostly between 🇩🇪 and 🇹🇭
  `

  const result = await createProfileExtraction(profile)

  console.log("result", JSON.stringify(result, null, 2))
})()
