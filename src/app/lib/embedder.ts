import axios from "axios"

class Embedder {
  private apiKey: string | undefined

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY // Load API key from environment variables
    if (!this.apiKey) {
      throw new Error(
        "OpenAI API key is required. Please set OPENAI_API_KEY in your environment."
      )
    }
  }

  async embed(text: string) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/embeddings",
        {
          model: "text-embedding-ada-002", // OpenAI embedding model
          input: text,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      )

      const embedding = response.data.data[0].embedding

      console.log("text", text)
      console.log("embedding", embedding)

      return {
        text,
        values: embedding,
      }
    } catch (error) {
      console.error("Error generating embedding:", error)
      throw error
    }
  }
}

const embedder = new Embedder()

export { embedder }

// import { AllTasks, pipeline } from "@xenova/transformers"

// // Embedder class for feature extraction
// class Embedder {
//   // Declare a pipeline for feature extraction
//   private pipe: AllTasks["feature-extraction"] | null = null

//   // Initialize the pipeline
//   async init() {
//     // The pipeline is initialized with the "feature-extraction" task and the "Xenova/all-MiniLM-L6-v2" model
//     this.pipe = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
//   }

//   // Method to embed a single string
//   async embed(text: string) {
//     // If the pipeline is not initialized, initialize it
//     if (!this.pipe) {
//       await this.init()
//     }
//     // Use the pipeline to extract features from the text
//     const result =
//       this.pipe && (await this.pipe(text, { pooling: "mean", normalize: true }))
//     // Return an object with the original text and the extracted features
//     return {
//       text,
//       values: Array.from(result?.data || []),
//     }
//   }
// }

// // Create a singleton instance of the Embedder class
// const embedder = new Embedder()

// // Export the embedder instance
// export { embedder }
