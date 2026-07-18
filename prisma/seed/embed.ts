import { randomUUID } from "node:crypto";
import { prisma } from "../../src/lib/prisma";
import { embedTexts, toVectorLiteral } from "../../src/server/ai/embeddings/embedding-client";

export interface EmbeddingSourceInput {
  productId: string;
  sourceText: string;
}

/**
 * Embeds and upserts `ProductEmbedding` rows via raw SQL — Prisma Client
 * cannot read/write the `Unsupported("vector(384)")` column directly.
 */
export async function embedAndStoreProducts(
  inputs: EmbeddingSourceInput[],
  modelId: string,
  batchSize = 16,
): Promise<void> {
  for (let i = 0; i < inputs.length; i += batchSize) {
    const batch = inputs.slice(i, i + batchSize);
    const vectors = await embedTexts(batch.map((b) => b.sourceText));

    for (let j = 0; j < batch.length; j++) {
      const { productId, sourceText } = batch[j];
      const vectorLiteral = toVectorLiteral(vectors[j]);
      const id = randomUUID();

      await prisma.$executeRaw`
        INSERT INTO "ProductEmbedding" (id, "productId", embedding, "sourceText", "embeddingModel", "createdAt", "updatedAt")
        VALUES (${id}, ${productId}, ${vectorLiteral}::vector, ${sourceText}, ${modelId}, now(), now())
        ON CONFLICT ("productId") DO UPDATE SET
          embedding = EXCLUDED.embedding,
          "sourceText" = EXCLUDED."sourceText",
          "embeddingModel" = EXCLUDED."embeddingModel",
          "updatedAt" = now()
      `;
    }

    console.log(`  embedded ${Math.min(i + batchSize, inputs.length)}/${inputs.length} products`);
  }
}

/** Text embedded per product: name/brand/category/specs/price so both semantic phrasing and literal spec terms are captured. */
export function buildEmbeddingSourceText(product: {
  name: string;
  brandName: string;
  categoryName: string;
  type: string;
  description: string;
  price: number;
  specs: Record<string, unknown>;
}): string {
  const specLines = Object.entries(product.specs)
    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
    .join("; ");

  return [
    `${product.name} by ${product.brandName}`,
    `Category: ${product.categoryName} (${product.type})`,
    `Price: $${product.price}`,
    product.description,
    `Specs: ${specLines}`,
  ].join("\n");
}
