-- Prisma's schema DSL cannot express pgvector index types, so this HNSW index
-- is added by hand. Cosine distance matches the similarity metric used by the
-- RAG retrieval query (server/ai/rag/retrieval.ts, `<=>` operator).
CREATE INDEX "ProductEmbedding_embedding_hnsw_idx"
  ON "ProductEmbedding"
  USING hnsw ("embedding" vector_cosine_ops);
