
-- Add location field to portfolio_items table
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS location text;
