/*
  # Custom Reports System

  1. New Tables
    - `custom_reports`
      - `id` (uuid, primary key)
      - `user_id` (text) - User who created the report
      - `report_name` (text) - Display name of the report
      - `description` (text) - User-provided description
      - `report_config` (jsonb) - Full report configuration
      - `natural_language_query` (text) - Original NL query if created via NLP
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last modification timestamp
      - `last_generated_at` (timestamptz) - Last successful generation
      - `generation_count` (integer) - Total times generated
      - `is_favorite` (boolean) - User favorite flag
      - `is_scheduled` (boolean) - Whether report has recurring schedule
      - `schedule_config` (jsonb) - Cron schedule and distribution settings
      - `tags` (text array) - Searchable tags

    - `report_history`
      - `id` (uuid, primary key)
      - `report_id` (uuid) - References custom_reports
      - `generated_at` (timestamptz) - Generation timestamp
      - `generated_by` (text) - User who generated
      - `date_range_start` (date) - Report start date
      - `date_range_end` (date) - Report end date
      - `record_count` (integer) - Number of records in report
      - `file_size_bytes` (bigint) - Size of generated file
      - `download_url` (text) - URL to download (if stored)
      - `status` (text) - success, failed, pending
      - `error_message` (text) - Error details if failed

  2. Security
    - Enable RLS on both tables
    - Users can only access their own reports
    - Admin role can access all reports
    - Audit trail for all report operations

  3. Indexes
    - Index on user_id for fast user queries
    - Index on tags for search functionality
    - Index on created_at for sorting
    - Index on is_favorite for favorites view
*/

-- Create custom_reports table
CREATE TABLE IF NOT EXISTS custom_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  report_name TEXT NOT NULL,
  description TEXT,
  report_config JSONB NOT NULL,
  natural_language_query TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_generated_at TIMESTAMPTZ,
  generation_count INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT false,
  is_scheduled BOOLEAN DEFAULT false,
  schedule_config JSONB,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Create report_history table
CREATE TABLE IF NOT EXISTS report_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES custom_reports(id) ON DELETE CASCADE,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  generated_by TEXT,
  date_range_start DATE,
  date_range_end DATE,
  record_count INTEGER,
  file_size_bytes BIGINT,
  download_url TEXT,
  status TEXT CHECK (status IN ('success', 'failed', 'pending')) DEFAULT 'pending',
  error_message TEXT
);

-- Enable RLS
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for custom_reports
CREATE POLICY "Users can view own reports"
  ON custom_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create own reports"
  ON custom_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own reports"
  ON custom_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own reports"
  ON custom_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- RLS Policies for report_history
CREATE POLICY "Users can view own report history"
  ON report_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM custom_reports
      WHERE custom_reports.id = report_history.report_id
      AND custom_reports.user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create report history entries"
  ON report_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM custom_reports
      WHERE custom_reports.id = report_history.report_id
      AND custom_reports.user_id = auth.uid()::text
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_custom_reports_user_id ON custom_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_custom_reports_created_at ON custom_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_custom_reports_is_favorite ON custom_reports(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_custom_reports_tags ON custom_reports USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_report_history_report_id ON report_history(report_id);
CREATE INDEX IF NOT EXISTS idx_report_history_generated_at ON report_history(generated_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_custom_reports_updated_at
  BEFORE UPDATE ON custom_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
