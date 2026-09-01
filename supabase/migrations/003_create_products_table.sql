-- Create products table for marketplace items
-- Products can be created by users for designers to work on

CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived', 'sold');
CREATE TYPE product_category AS ENUM ('design', 'development', 'content', 'marketing', 'other');

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category product_category DEFAULT 'other',
  price DECIMAL(10, 2) NOT NULL,
  status product_status DEFAULT 'draft',
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  designer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  quantity_available INTEGER DEFAULT 1,
  quantity_sold INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  featured_until TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_designer_id ON products(designer_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view active products
CREATE POLICY "Users can view active products"
  ON products FOR SELECT
  USING (status = 'active');

-- RLS Policy: Users can view their own products (even drafts)
CREATE POLICY "Users can view their own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Users can create products
CREATE POLICY "Users can create products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own products
CREATE POLICY "Users can update their own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own products
CREATE POLICY "Users can delete their own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policy: Admins can view all products
CREATE POLICY "Admins can view all products"
  ON products FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );
