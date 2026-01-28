
-- Add status to products table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='status') THEN
    ALTER TABLE products ADD COLUMN status text DEFAULT 'Available';
  END IF;
END $$;

-- Update products with check constraint for status
-- Note: Check constraints can be tricky if data already exists, but for a new project it's fine.
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;
ALTER TABLE products ADD CONSTRAINT products_status_check CHECK (status IN ('Available', 'In Use', 'Maintenance', 'Out of Stock'));

-- Also add stock and status to portfolio_items to satisfy the specific feedback about that table's metadata
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_items' AND column_name='stock') THEN
    ALTER TABLE portfolio_items ADD COLUMN stock integer DEFAULT 1;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='portfolio_items' AND column_name='status') THEN
    ALTER TABLE portfolio_items ADD COLUMN status text DEFAULT 'Available';
  END IF;
END $$;

ALTER TABLE portfolio_items DROP CONSTRAINT IF EXISTS portfolio_items_status_check;
ALTER TABLE portfolio_items ADD CONSTRAINT portfolio_items_status_check CHECK (status IN ('Available', 'In Use', 'Maintenance', 'Out of Stock'));
