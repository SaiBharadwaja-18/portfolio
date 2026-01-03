/*
  # Create Portfolio Database Schema
  
  ## Overview
  Creates all necessary tables for a bilingual (EN/JP) personal portfolio website
  with blog, projects, research, achievements, conferences, certifications, and skills.
  
  ## New Tables
  
  ### 1. blogs
  - `id` (uuid, primary key)
  - `title` (text) - English title
  - `title_jp` (text) - Japanese title
  - `slug` (text, unique) - URL-friendly identifier
  - `category` (text) - Blog category
  - `content` (text) - English content (Markdown)
  - `content_jp` (text) - Japanese content (Markdown)
  - `images` (jsonb) - Array of image URLs
  - `audio_url` (text) - Optional Japanese audio URL
  - `publish_date` (timestamptz) - Publication date
  - `status` (text) - 'draft' or 'published'
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. projects
  - `id` (uuid, primary key)
  - `title` (text) - English title
  - `title_jp` (text) - Japanese title
  - `description` (text) - English description
  - `description_jp` (text) - Japanese description
  - `images` (jsonb) - Array of image URLs
  - `tech_stack` (jsonb) - Array of technologies
  - `project_link` (text) - Live project URL
  - `github_link` (text) - GitHub repository URL
  - `date` (timestamptz)
  - `order_index` (integer) - For custom sorting
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. research
  - `id` (uuid, primary key)
  - `title` (text) - English title
  - `title_jp` (text) - Japanese title
  - `description` (text) - English description
  - `description_jp` (text) - Japanese description
  - `content` (text) - English full content
  - `content_jp` (text) - Japanese full content
  - `images` (jsonb) - Array of image URLs
  - `date` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. achievements
  - `id` (uuid, primary key)
  - `title` (text) - English title
  - `title_jp` (text) - Japanese title
  - `description` (text) - English description
  - `description_jp` (text) - Japanese description
  - `date` (timestamptz)
  - `image` (text) - Single image URL
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. conferences
  - `id` (uuid, primary key)
  - `title` (text) - English title
  - `title_jp` (text) - Japanese title
  - `description` (text) - English description
  - `description_jp` (text) - Japanese description
  - `date` (timestamptz)
  - `location` (text)
  - `images` (jsonb) - Array of image URLs
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 6. certifications
  - `id` (uuid, primary key)
  - `title` (text) - English title
  - `title_jp` (text) - Japanese title
  - `description` (text) - English description
  - `description_jp` (text) - Japanese description
  - `images` (jsonb) - Array of document/certificate image URLs
  - `type` (text) - 'certificate', 'lor', or 'other'
  - `date` (timestamptz)
  - `download_url` (text) - Optional download link
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 7. skills
  - `id` (uuid, primary key)
  - `name` (text) - English skill name
  - `name_jp` (text) - Japanese skill name
  - `category` (text) - Skill category
  - `proficiency` (integer) - 1-100 skill level
  - `order_index` (integer) - For custom sorting
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 8. profile
  - `id` (uuid, primary key)
  - `name` (text) - Full name
  - `name_jp` (text) - Japanese name
  - `tagline` (text) - English tagline/subtitle
  - `tagline_jp` (text) - Japanese tagline
  - `bio` (text) - English biography
  - `bio_jp` (text) - Japanese biography
  - `avatar_url` (text) - Profile image
  - `resume_url_en` (text) - English resume PDF
  - `resume_url_jp` (text) - Japanese resume PDF
  - `email` (text)
  - `github` (text)
  - `linkedin` (text)
  - `twitter` (text)
  - `updated_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Public read access for published content
  - Admin-only write access (authenticated users)
*/

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_jp text,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'general',
  content text NOT NULL,
  content_jp text,
  images jsonb DEFAULT '[]'::jsonb,
  audio_url text,
  publish_date timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_jp text,
  description text NOT NULL,
  description_jp text,
  images jsonb DEFAULT '[]'::jsonb,
  tech_stack jsonb DEFAULT '[]'::jsonb,
  project_link text,
  github_link text,
  date timestamptz DEFAULT now(),
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create research table
CREATE TABLE IF NOT EXISTS research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_jp text,
  description text NOT NULL,
  description_jp text,
  content text,
  content_jp text,
  images jsonb DEFAULT '[]'::jsonb,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_jp text,
  description text NOT NULL,
  description_jp text,
  date timestamptz DEFAULT now(),
  image text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create conferences table
CREATE TABLE IF NOT EXISTS conferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_jp text,
  description text NOT NULL,
  description_jp text,
  date timestamptz DEFAULT now(),
  location text,
  images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  title_jp text,
  description text NOT NULL,
  description_jp text,
  images jsonb DEFAULT '[]'::jsonb,
  type text NOT NULL DEFAULT 'certificate',
  date timestamptz DEFAULT now(),
  download_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_jp text,
  category text NOT NULL DEFAULT 'general',
  proficiency integer DEFAULT 50,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profile table
CREATE TABLE IF NOT EXISTS profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_jp text,
  tagline text,
  tagline_jp text,
  bio text,
  bio_jp text,
  avatar_url text,
  resume_url_en text,
  resume_url_jp text,
  email text,
  github text,
  linkedin text,
  twitter text,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE research ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE conferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published blogs"
  ON blogs FOR SELECT
  USING (status = 'published');

CREATE POLICY "Public can view all projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Public can view all research"
  ON research FOR SELECT
  USING (true);

CREATE POLICY "Public can view all achievements"
  ON achievements FOR SELECT
  USING (true);

CREATE POLICY "Public can view all conferences"
  ON conferences FOR SELECT
  USING (true);

CREATE POLICY "Public can view all certifications"
  ON certifications FOR SELECT
  USING (true);

CREATE POLICY "Public can view all skills"
  ON skills FOR SELECT
  USING (true);

CREATE POLICY "Public can view profile"
  ON profile FOR SELECT
  USING (true);

-- Admin write access (authenticated users only)
CREATE POLICY "Authenticated users can insert blogs"
  ON blogs FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blogs"
  ON blogs FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blogs"
  ON blogs FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert research"
  ON research FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update research"
  ON research FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete research"
  ON research FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert achievements"
  ON achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update achievements"
  ON achievements FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete achievements"
  ON achievements FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert conferences"
  ON conferences FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update conferences"
  ON conferences FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete conferences"
  ON conferences FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert certifications"
  ON certifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certifications"
  ON certifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete certifications"
  ON certifications FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update profile"
  ON profile FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert profile"
  ON profile FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_publish_date ON blogs(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(date DESC);
CREATE INDEX IF NOT EXISTS idx_research_date ON research(date DESC);
CREATE INDEX IF NOT EXISTS idx_achievements_date ON achievements(date DESC);
CREATE INDEX IF NOT EXISTS idx_conferences_date ON conferences(date DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_date ON certifications(date DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_research_updated_at BEFORE UPDATE ON research
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conferences_updated_at BEFORE UPDATE ON conferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_updated_at BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();