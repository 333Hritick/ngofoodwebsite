/*
  # Food Sharing Application Schema

  ## Overview
  Creates a complete schema for a sustainable food sharing platform where donors can share extra food,
  NGOs can claim donations, and both parties can track the delivery process.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `role` (text) - Either 'donor' or 'ngo'
  - `phone` (text) - Contact phone number
  - `address` (text) - Physical address
  - `organization_name` (text, nullable) - For NGO users only
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. food_donations
  - `id` (uuid, primary key) - Unique donation identifier
  - `donor_id` (uuid) - References profiles(id)
  - `title` (text) - Short title of the food item
  - `description` (text) - Detailed description
  - `quantity` (text) - Quantity/serving size
  - `food_type` (text) - Category: cooked, packaged, fresh_produce, etc.
  - `expiry_time` (timestamptz) - When food should be picked up by
  - `pickup_address` (text) - Where to collect the food
  - `status` (text) - available, claimed, picked_up, delivered
  - `created_at` (timestamptz) - When donation was posted
  - `updated_at` (timestamptz) - Last modification time

  ### 3. pickups
  - `id` (uuid, primary key) - Unique pickup identifier
  - `donation_id` (uuid) - References food_donations(id)
  - `ngo_id` (uuid) - References profiles(id) for NGO
  - `claimed_at` (timestamptz) - When NGO claimed the donation
  - `picked_up_at` (timestamptz, nullable) - When food was collected
  - `delivered_at` (timestamptz, nullable) - When food reached beneficiaries
  - `beneficiary_count` (integer) - Number of people served
  - `notes` (text) - Additional notes from NGO

  ### 4. tracking_updates
  - `id` (uuid, primary key) - Unique update identifier
  - `pickup_id` (uuid) - References pickups(id)
  - `status` (text) - claimed, picked_up, in_transit, delivered
  - `message` (text) - Status update message
  - `created_at` (timestamptz) - When update was posted
  - `created_by` (uuid) - References profiles(id)

  ## Security
  - Enable RLS on all tables
  - Donors can manage their own donations
  - NGOs can view available donations and manage their pickups
  - Both parties can view tracking for their involved donations
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL CHECK (role IN ('donor', 'ngo')),
  phone text,
  address text,
  organization_name text,
  created_at timestamptz DEFAULT now()
);

-- Create food_donations table
CREATE TABLE IF NOT EXISTS food_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  quantity text NOT NULL,
  food_type text NOT NULL CHECK (food_type IN ('cooked', 'packaged', 'fresh_produce', 'baked', 'other')),
  expiry_time timestamptz NOT NULL,
  pickup_address text NOT NULL,
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'claimed', 'picked_up', 'delivered')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pickups table
CREATE TABLE IF NOT EXISTS pickups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid NOT NULL REFERENCES food_donations(id) ON DELETE CASCADE,
  ngo_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  claimed_at timestamptz DEFAULT now(),
  picked_up_at timestamptz,
  delivered_at timestamptz,
  beneficiary_count integer DEFAULT 0,
  notes text,
  UNIQUE(donation_id)
);

-- Create tracking_updates table
CREATE TABLE IF NOT EXISTS tracking_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_id uuid NOT NULL REFERENCES pickups(id) ON DELETE CASCADE,
  status text NOT NULL CHECK (status IN ('claimed', 'picked_up', 'in_transit', 'delivered')),
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_updates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Food donations policies
CREATE POLICY "Anyone can view available donations"
  ON food_donations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Donors can create donations"
  ON food_donations FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = donor_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'donor')
  );

CREATE POLICY "Donors can update own donations"
  ON food_donations FOR UPDATE
  TO authenticated
  USING (auth.uid() = donor_id)
  WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can delete own donations"
  ON food_donations FOR DELETE
  TO authenticated
  USING (auth.uid() = donor_id);

-- Pickups policies
CREATE POLICY "Users can view pickups they're involved in"
  ON pickups FOR SELECT
  TO authenticated
  USING (
    auth.uid() = ngo_id OR
    auth.uid() IN (SELECT donor_id FROM food_donations WHERE id = donation_id)
  );

CREATE POLICY "NGOs can create pickups"
  ON pickups FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = ngo_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ngo')
  );

CREATE POLICY "NGOs can update own pickups"
  ON pickups FOR UPDATE
  TO authenticated
  USING (auth.uid() = ngo_id)
  WITH CHECK (auth.uid() = ngo_id);

-- Tracking updates policies
CREATE POLICY "Users can view tracking for their pickups"
  ON tracking_updates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pickups p
      JOIN food_donations fd ON p.donation_id = fd.id
      WHERE p.id = pickup_id
      AND (p.ngo_id = auth.uid() OR fd.donor_id = auth.uid())
    )
  );

CREATE POLICY "NGOs can create tracking updates"
  ON tracking_updates FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (SELECT 1 FROM pickups WHERE id = pickup_id AND ngo_id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_food_donations_donor_id ON food_donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_food_donations_status ON food_donations(status);
CREATE INDEX IF NOT EXISTS idx_pickups_donation_id ON pickups(donation_id);
CREATE INDEX IF NOT EXISTS idx_pickups_ngo_id ON pickups(ngo_id);
CREATE INDEX IF NOT EXISTS idx_tracking_updates_pickup_id ON tracking_updates(pickup_id);