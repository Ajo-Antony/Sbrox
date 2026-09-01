-- Create reviews table for ratings and feedback
-- Reviews are between users and designers after bookings

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_designer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  professionalism INTEGER CHECK (professionalism >= 1 AND professionalism <= 5),
  quality INTEGER CHECK (quality >= 1 AND quality <= 5),
  communication INTEGER CHECK (communication >= 1 AND communication <= 5),
  on_time_delivery BOOLEAN,
  would_recommend BOOLEAN DEFAULT FALSE,
  images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN DEFAULT TRUE,
  helpful_count INTEGER DEFAULT 0,
  unhelpful_count INTEGER DEFAULT 0,
  response_from_designer TEXT,
  response_at TIMESTAMP WITH TIME ZONE,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_reviews_from_user_id ON reviews(from_user_id);
CREATE INDEX idx_reviews_to_designer_id ON reviews(to_designer_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_would_recommend ON reviews(would_recommend);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_to_designer_created_at ON reviews(to_designer_id, created_at DESC);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

-- RLS Policy: Users can create reviews for completed bookings
CREATE POLICY "Users can create reviews for their bookings"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- RLS Policy: Designers can respond to reviews
CREATE POLICY "Designers can respond to reviews on their profile"
  ON reviews FOR UPDATE
  USING (auth.uid() = to_designer_id)
  WITH CHECK (auth.uid() = to_designer_id);

-- RLS Policy: Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = from_user_id)
  WITH CHECK (auth.uid() = from_user_id);

-- RLS Policy: Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = from_user_id);

-- RLS Policy: Admins can manage reviews
CREATE POLICY "Admins can manage reviews"
  ON reviews FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );
