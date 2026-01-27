
-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Portfolio items are publicly readable"
  ON portfolio_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated full access (Admin)
CREATE POLICY "Authenticated users can manage portfolio items"
  ON portfolio_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create storage bucket if it doesn't exist
-- Note: This might fail if the bucket already exists or if the user doesn't have permissions to insert into storage.buckets.
-- In a real Supabase environment, you might do this via the dashboard or a more complex SQL script.
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Portfolio images are publicly accessible"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can upload portfolio images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can update/delete portfolio images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio');

CREATE POLICY "Authenticated users can delete portfolio images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio');
