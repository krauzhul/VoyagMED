/*
  # Create Telegram integration tables

  1. New Tables
    - `telegram_users`: Stores Telegram user data and links to patients
    - `notification_acknowledgments`: Tracks notification acknowledgments

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create telegram_users table
CREATE TABLE IF NOT EXISTS telegram_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id bigint REFERENCES patients(patient_id),
  chat_id bigint NOT NULL,
  username text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(chat_id)
);

-- Create notification_acknowledgments table
CREATE TABLE IF NOT EXISTS notification_acknowledgments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id bigint REFERENCES notifications(notification_id),
  chat_id bigint REFERENCES telegram_users(chat_id),
  acknowledged_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'telegram_users' 
    AND policyname = 'Allow read access to telegram_users'
  ) THEN
    CREATE POLICY "Allow read access to telegram_users"
      ON telegram_users
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'notification_acknowledgments' 
    AND policyname = 'Allow read access to notification_acknowledgments'
  ) THEN
    CREATE POLICY "Allow read access to notification_acknowledgments"
      ON notification_acknowledgments
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;