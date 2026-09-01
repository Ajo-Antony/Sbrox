-- Create admin_actions table for logging administrative activities
-- Tracks all actions performed by admins and superadmins

CREATE TYPE admin_action_type AS ENUM (
  'user_created', 'user_updated', 'user_deleted', 'user_verified', 'user_suspended', 'user_activated',
  'designer_featured', 'designer_unfeatured', 'designer_verified', 'designer_suspended',
  'product_featured', 'product_archived', 'product_approved', 'product_rejected',
  'booking_cancelled', 'booking_approved', 'booking_rejected',
  'payment_refunded', 'payment_disputed', 'payment_verified',
  'dispute_resolved', 'dispute_appealed', 'dispute_closed',
  'content_moderated', 'content_removed', 'content_approved',
  'commission_updated', 'payment_setting_updated',
  'user_banned', 'user_unbanned', 'other'
);

CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  action_type admin_action_type NOT NULL,
  target_id UUID,
  target_type TEXT, -- 'user', 'designer', 'product', 'booking', 'payment', 'review', 'dispute', 'other'
  reason TEXT,
  details JSONB DEFAULT '{}',
  status TEXT, -- 'pending', 'approved', 'completed', 'failed', 'reverted'
  ip_address INET,
  user_agent TEXT,
  old_values JSONB,
  new_values JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_admin_actions_admin_id ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_action_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_target_id ON admin_actions(target_id);
CREATE INDEX idx_admin_actions_target_type ON admin_actions(target_type);
CREATE INDEX idx_admin_actions_created_at ON admin_actions(created_at DESC);
CREATE INDEX idx_admin_actions_status ON admin_actions(status);

-- Create trigger for updating updated_at timestamp
CREATE TRIGGER update_admin_actions_updated_at
BEFORE UPDATE ON admin_actions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can view admin actions
CREATE POLICY "Only admins can view admin actions"
  ON admin_actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );

-- RLS Policy: Only system can create admin actions (via triggers)
CREATE POLICY "System can create admin actions"
  ON admin_actions FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Only admins can update admin actions
CREATE POLICY "Only admins can update admin actions"
  ON admin_actions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('superadmin', 'admin')
    )
  );

-- RLS Policy: Only superadmins can delete admin actions
CREATE POLICY "Only superadmins can delete admin actions"
  ON admin_actions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'superadmin'
    )
  );
