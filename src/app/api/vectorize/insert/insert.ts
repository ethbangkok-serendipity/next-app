import { COLLECTION_NAME, milvus } from "@/app/lib/milvus"
import { embedder } from "@/app/lib/embedder"

const insertIntoVectorDB = async (data: any) => {
  const vector = await embedder.embed(JSON.stringify(data))

  const insertData = {
    vector: vector.values,
  }

  const result = await milvus.insert({
    fields_data: [insertData],
    collection_name: COLLECTION_NAME,
  })

  return result
}

export default insertIntoVectorDB
