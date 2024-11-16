import { COLLECTION_NAME, milvus } from "@/app/lib/milvus"

const insertIntoVectorDB = async (vector: any, name: string) => {
  const insertData = {
    vector: vector.values,
    name
  }

  const result = await milvus.insert({
    fields_data: [insertData],
    collection_name: COLLECTION_NAME,
  })

  return result
}

export default insertIntoVectorDB
