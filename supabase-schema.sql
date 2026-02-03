-- Supabase Schema for Business Card Organizer
-- Run this in your Supabase SQL Editor

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  job_title TEXT,
  company TEXT,
  emails JSONB DEFAULT '[]'::jsonb,
  phones JSONB DEFAULT '[]'::jsonb,
  address JSONB DEFAULT '{}'::jsonb,
  website TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  card_image_url TEXT,
  card_thumbnail_url TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_full_name ON contacts(full_name);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_is_favorite ON contacts(is_favorite);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING GIN(tags);

-- Enable Row Level Security (RLS)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo/development)
-- In production, you should add proper authentication policies
CREATE POLICY "Allow all operations on contacts" ON contacts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage buckets
-- Note: Run these in the Supabase Dashboard > Storage section
-- Or use the Supabase CLI

-- Bucket: cards (for original card images)
-- Bucket: thumbnails (for thumbnail images)

-- Storage policies (run in SQL editor after creating buckets)
-- Allow public read access to card images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cards', 'cards', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow anyone to upload/read/delete (for demo)
-- In production, add proper authentication
CREATE POLICY "Allow public access to cards" ON storage.objects
  FOR ALL
  USING (bucket_id = 'cards')
  WITH CHECK (bucket_id = 'cards');

CREATE POLICY "Allow public access to thumbnails" ON storage.objects
  FOR ALL
  USING (bucket_id = 'thumbnails')
  WITH CHECK (bucket_id = 'thumbnails');
