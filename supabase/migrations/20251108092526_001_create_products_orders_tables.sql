/*
  # Create Products and Orders Tables

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text, product name)
      - `description` (text, product description)
      - `price` (numeric, price in EUR)
      - `category` (text, product category)
      - `image_url` (text, product image URL)
      - `stock` (integer, available quantity)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, authenticated user)
      - `total_amount` (numeric, order total)
      - `status` (text, order status: pending, completed, failed)
      - `stripe_payment_id` (text, Stripe payment reference)
      - `created_at` (timestamp)

    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key to orders)
      - `product_id` (uuid, foreign key to products)
      - `quantity` (integer, item quantity)
      - `price_at_purchase` (numeric, price at time of purchase)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Products: public read, authenticated create/update/delete
    - Orders: users can read/create their own orders only
    - Order items: users can read items from their orders only

  3. Indexes
    - Product category for filtering
    - Order user_id and status for queries
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price > 0),
  category text NOT NULL,
  image_url text,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  stripe_payment_id text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL CHECK (quantity > 0),
  price_at_purchase numeric NOT NULL CHECK (price_at_purchase > 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Users can read their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read order items from their orders"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for their orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
