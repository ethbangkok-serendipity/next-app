/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  serverExternalPackages: [
    "sharp",
    // "onnxruntime-node",
    "@zilliz/milvus2-sdk-node",
  ],
  outputFileTracingIncludes: {
    // When deploying to Vercel, the following configuration is required
    "/api/**/*": ["node_modules/@zilliz/milvus2-sdk-node/dist/proto/**/*"],
  },
}

export default nextConfig
