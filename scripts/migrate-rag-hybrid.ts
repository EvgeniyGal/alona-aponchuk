import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");

  const sql = neon(url);

  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  console.log("Enabled pgvector extension");

  await sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'rag_chunks'
          AND column_name = 'embedding'
          AND data_type = 'text'
      ) THEN
        ALTER TABLE rag_chunks
          ALTER COLUMN embedding TYPE vector(1536)
          USING (
            CASE
              WHEN embedding IS NULL OR btrim(embedding) = '' THEN NULL
              ELSE embedding::vector
            END
          );
      END IF;
    END
    $$
  `;
  console.log("rag_chunks.embedding is vector(1536)");

  await sql`
    CREATE INDEX IF NOT EXISTS rag_chunks_embedding_hnsw
    ON rag_chunks
    USING hnsw (embedding vector_cosine_ops)
  `;
  console.log("Created HNSW index on embeddings");

  await sql`
    CREATE INDEX IF NOT EXISTS rag_chunks_content_fts
    ON rag_chunks
    USING gin (to_tsvector('simple', content))
  `;
  console.log("Created GIN index for keyword search");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
