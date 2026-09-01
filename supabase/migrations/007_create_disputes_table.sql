-- Create disputes table for conflict resolution
-- Handles issues between users and designers

CREATE TYPE dispute_status AS ENUM ('open', 'under_review', 'resolved', 'closed', 'appealed');
CREATE TYPE dispute_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  raised_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  raised_against_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  status dispute_status DEFAULT 'open',
  priority dispute_priority DEFAULT 'medium',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence TEXT[] DEFAULT '{}',
  category TEXT, -- 'quality', 'delivery', 'communication', 'payment', 'cancellation', 'other'
  resolution_requested TEXT,
  refund_requested DECIMAL(10, 2),
  admin_assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  admin_notes TEXT,
  resolution_details TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_date TIMESTAMP WITH TIME ZONE,
  appeal_reason TEXT,
  appealed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_disputes_booking_id ON disputes(booking_id);
CREATE INDEX idx_disputes_raised_by ON disputes(raised_by_user_id);
CREATE INDEX idx_disputes_raised_against ON disputes(raised_against_user_id);
CREATE INDEX idx_disputes_status ON disputes(status);
CREATE INDEX idx_disputes_priority ON disputes(priority);
CREATE INDEX idx_disputes_admin_assigned ON disputes(admin_assigned_to);
CREATE INDEX idx_disputes_created_at ON disputes(created_at DESC);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_disputes_updated_at
BEFORE UPDATE ON disputes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view disputes they're involved in
CREATE POLICY "Users can view their own disputes"
  ON disputes FOR SELECT
  USING (
    auth.uid() = raised_by_user_id 
    OR auth.uid() = raised_against_user_id
  );

-- RLS Policy: Users can create disputes
CREATE POLICY "Users can create disputes"
  ON disputes FOR INSERT
  WITH CHECK (auth.uid() = raised_by_user_id);

-- RLS Policy: Dispute parties can update their own disputes
CREATE POLICY "Dispute parties can update disputes"
  ON disputes FOR UPDATE
  USING (
    auth.uid() = raised_by_user_id 
    OR auth.uid() = raised_against_user_id
  )
  WITH CHECK (
    auth.uid() = raised_by_user_id 
    OR auth.uid() = raised_against_user_id
  );

-- RLS Policy: Admins can manage all disputes
CREATE POLICY "Admins can manage all disputes"
  ON disputes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );
