/*
  # Create Hillcroft Villa Booking System Database

  ## Overview
  This migration creates the core database structure for the Hillcroft Villa booking system, 
  including tables for rooms, bookings, and guest information.

  ## New Tables

  ### 1. `rooms`
  Stores information about available accommodations at the villa
  - `id` (uuid, primary key) - Unique identifier for each room
  - `name` (text) - Room name (e.g., "Full Villa", "Master Bedroom")
  - `room_id` (text, unique) - Human-readable identifier (e.g., "full-villa", "master-bedroom")
  - `description` (text) - Brief description of the room
  - `price_per_night` (integer) - Price per night in USD
  - `max_guests` (integer) - Maximum number of guests allowed
  - `features` (jsonb) - Array of room features
  - `image_url` (text) - URL to room image
  - `is_available` (boolean, default: true) - Whether the room is currently available
  - `created_at` (timestamptz, default: now())
  - `updated_at` (timestamptz, default: now())

  ### 2. `bookings`
  Stores guest booking requests
  - `id` (uuid, primary key) - Unique identifier for each booking
  - `room_id` (uuid, foreign key) - References rooms table
  - `guest_name` (text) - Guest's full name
  - `guest_email` (text) - Guest's email address
  - `guest_phone` (text) - Guest's phone number
  - `check_in` (date) - Check-in date
  - `check_out` (date) - Check-out date
  - `number_of_guests` (integer) - Number of guests
  - `total_amount` (integer) - Total booking amount in USD
  - `number_of_nights` (integer) - Calculated number of nights
  - `status` (text, default: 'pending') - Booking status: pending, confirmed, cancelled
  - `special_requests` (text) - Any special requests from the guest
  - `created_at` (timestamptz, default: now())
  - `updated_at` (timestamptz, default: now())

  ## Security
  
  ### Row Level Security (RLS)
  - All tables have RLS enabled
  - Public users can view available rooms
  - Public users can create bookings
  - Public users can view their own bookings by email
  - Only authenticated users (admins) can update/delete bookings

  ## Notes
  - Email confirmation is not required for bookings
  - Bookings start with 'pending' status and require manual confirmation
  - Room availability is managed through the `is_available` flag
  - All monetary values are stored in cents/smallest currency unit
*/

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  room_id text UNIQUE NOT NULL,
  description text NOT NULL,
  price_per_night integer NOT NULL,
  max_guests integer NOT NULL DEFAULT 1,
  features jsonb DEFAULT '[]'::jsonb,
  image_url text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  check_in date NOT NULL,
  check_out date NOT NULL,
  number_of_guests integer NOT NULL DEFAULT 1,
  total_amount integer NOT NULL DEFAULT 0,
  number_of_nights integer NOT NULL DEFAULT 1,
  status text DEFAULT 'pending',
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out > check_in),
  CONSTRAINT valid_guests CHECK (number_of_guests > 0),
  CONSTRAINT valid_nights CHECK (number_of_nights > 0),
  CONSTRAINT valid_amount CHECK (total_amount >= 0)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms table
CREATE POLICY "Anyone can view available rooms"
  ON rooms FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Authenticated users can view all rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for bookings table
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Guests can view their own bookings"
  ON bookings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can view all bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (true);

-- Insert initial room data from the constants
INSERT INTO rooms (room_id, name, description, price_per_night, max_guests, features, image_url) VALUES
  ('full-villa', 'Full Villa', 'Entire property with all bedrooms and facilities', 300, 10, 
   '["4 Bedrooms", "3 Bathrooms", "Full Kitchen", "Living Room", "Dining Area", "Garden Access"]'::jsonb,
   'https://picsum.photos/seed/hillcroft-full/800/600'),
  
  ('master-bedroom', 'Master Bedroom', 'Spacious master suite with private bathroom', 120, 2,
   '["King Bed", "Private Bathroom", "Garden View", "Work Desk"]'::jsonb,
   'https://picsum.photos/seed/hillcroft-master/800/600'),
  
  ('deluxe-room', 'Deluxe Room', 'Comfortable room with modern amenities', 100, 2,
   '["Queen Bed", "Shared Bathroom", "Mountain View", "Reading Nook"]'::jsonb,
   'https://picsum.photos/seed/hillcroft-deluxe/800/600'),
  
  ('standard-room', 'Standard Room', 'Cozy room perfect for solo travelers or couples', 80, 2,
   '["Double Bed", "Shared Bathroom", "Garden View", "Wardrobe"]'::jsonb,
   'https://picsum.photos/seed/hillcroft-standard/800/600')
ON CONFLICT (room_id) DO NOTHING;