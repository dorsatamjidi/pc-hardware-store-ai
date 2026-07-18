import { pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";

/**
 * Local, in-process embedding model (transformers.js). Semantic search runs
 * on a free, offline model rather than a hosted embeddings API, so retrieval
 * keeps working even if the chat LLM provider/key changes. See docs/ai-pipeline.md.
 */
const MODEL_ID = process.env.EMBEDDING_MODEL || "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DIMENSIONS = 384;

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", MODEL_ID) as Promise<FeatureExtractionPipeline>;
  }
  return extractorPromise;
}

export async function embedText(text: string): Promise<number[]> {
  const extractor = await getExtractor();
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const extractor = await getExtractor();
  const vectors: number[][] = [];
  for (const text of texts) {
    const output = await extractor(text, { pooling: "mean", normalize: true });
    vectors.push(Array.from(output.data as Float32Array));
  }
  return vectors;
}

export function toVectorLiteral(vector: number[]): string {
  return `[${vector.join(",")}]`;
}
