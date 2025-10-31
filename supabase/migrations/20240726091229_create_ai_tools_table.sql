/*
  # AI Tools Showcase Database Schema

  1. New Tables
    - `ai_tools`
      - `id` (uuid, primary key) - Unique identifier for each AI tool
      - `name` (text, not null) - Name of the AI tool (e.g., "ChatGPT", "Grok")
      - `description` (text, not null) - Brief description of the tool
      - `url` (text, not null) - External link to the AI tool
      - `logo_url` (text) - URL for the tool's logo/icon
      - `category` (text, not null) - Category of the tool (e.g., "Chat", "Image Generation")
      - `features` (text array) - List of key features
      - `is_featured` (boolean, default false) - Whether to highlight this tool
      - `sort_order` (integer, default 0) - For custom ordering
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Security
    - Enable RLS on `ai_tools` table
    - Add policy for public read access (anyone can view tools)
    - Add policy for authenticated users to manage tools (for future admin features)

  3. Initial Data
    - Seed table with popular AI tools (ChatGPT, Grok, DeepSeek)
*/

CREATE TABLE IF NOT EXISTS ai_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  url text NOT NULL,
  logo_url text,
  category text NOT NULL DEFAULT 'General',
  features text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view AI tools"
  ON ai_tools
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert AI tools"
  ON ai_tools
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update AI tools"
  ON ai_tools
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete AI tools"
  ON ai_tools
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial AI tools data
INSERT INTO ai_tools (name, description, url, category, features, is_featured, sort_order) VALUES
  (
    'ChatGPT',
    'Advanced conversational AI powered by OpenAI. Engage in natural conversations, get help with writing, coding, analysis, and much more.',
    'https://chat.openai.com',
    'Conversational AI',
    ARRAY['Natural Language Processing', 'Code Generation', 'Creative Writing', 'Problem Solving', 'Multi-language Support'],
    true,
    1
  ),
  (
    'Grok',
    'X''s AI assistant with real-time knowledge and a unique personality. Get witty responses and access to current information from the X platform.',
    'https://grok.x.ai',
    'Conversational AI',
    ARRAY['Real-time Information', 'X Integration', 'Conversational Interface', 'Current Events', 'Witty Responses'],
    true,
    2
  ),
  (
    'DeepSeek',
    'Powerful AI model focused on deep reasoning and complex problem-solving. Perfect for technical tasks and in-depth analysis.',
    'https://www.deepseek.com',
    'Conversational AI',
    ARRAY['Deep Reasoning', 'Technical Analysis', 'Complex Problem Solving', 'Research Assistant', 'Code Understanding'],
    true,
    3
  );