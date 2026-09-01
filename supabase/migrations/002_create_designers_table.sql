-- Create designers table for detailed designer information
-- Extends users table with designer-specific data

CREATE TABLE IF NOT EXISTS designers (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  skills TEXT[] DEFAULT '{}',
  hourly_rate DECIMAL(10, 2),
  project_rate DECIMAL(10, 2),
  subscription_tier TEXT, -- 'basic', 'pro', 'premium'
  subscription_price DECIMAL(10, 2),
  total_hours_available INTEGER DEFAULT 0,
  hours_booked INTEGER DEFAULT 0,
  total_projects_completed INTEGER DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  cancellation_policy TEXT, -- 'strict', 'moderate', 'flexible'
  response_time_hours INTEGER DEFAULT 24,
  portfolio_items TEXT[] DEFAULT '{}',
  social_links JSONB DEFAULT '{}',
  documents JSONB DEFAULT '{}',
  bank_account_verified BOOLEAN DEFAULT FALSE,
  tax_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster queries
CREATE INDEX idx_designers_skills ON designers USING GIN(skills);
CREATE INDEX idx_designers_is_available ON designers(is_available);
CREATE INDEX idx_designers_is_featured ON designers(is_featured);
CREATE INDEX idx_designers_average_rating ON designers(average_rating DESC);
CREATE INDEX idx_designers_hourly_rate ON designers(hourly_rate);
CREATE INDEX idx_designers_subscription_tier ON designers(subscription_tier);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_designers_updated_at
BEFORE UPDATE ON designers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE designers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view designer profiles
CREATE POLICY "Anyone can view designer profiles"
  ON designers FOR SELECT
  USING (true);

-- RLS Policy: Designers can update their own profile
CREATE POLICY "Designers can update their own profile"
  ON designers FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policy: Designers can insert their own profile
CREATE POLICY "Designers can insert their own profile"
  ON designers FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policy: Admins can update any designer profile
CREATE POLICY "Admins can update any designer profile"
  ON designers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );
