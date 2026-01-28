-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    location TEXT DEFAULT 'Roma',
    price DECIMAL(10,2) DEFAULT 0,
    stock INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Available',
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow public read access" ON products;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated full access" ON products;
CREATE POLICY "Allow authenticated full access" ON products FOR ALL USING (auth.role() = 'authenticated');
