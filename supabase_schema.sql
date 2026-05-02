-- Leads Table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  phone TEXT UNIQUE NOT NULL,
  stage TEXT DEFAULT 'New',
  current_flow_id UUID,
  current_step_index INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender TEXT CHECK (sender IN ('user', 'ai', 'admin')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flows Table
CREATE TABLE flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  trigger_type TEXT NOT NULL,
  trigger_keyword TEXT,
  steps JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base Table (with vector support)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536), -- For OpenAI text-embedding-3-small
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function for similarity search
CREATE OR REPLACE FUNCTION match_knowledge (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    knowledge_base.id,
    knowledge_base.content,
    knowledge_base.metadata,
    1 - (knowledge_base.embedding <=> query_embedding) AS similarity
  FROM knowledge_base
  WHERE 1 - (knowledge_base.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
