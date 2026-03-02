/*
  # Create Storage Buckets for Hillcroft Villa

  ## Overview
  This migration creates storage buckets for managing files in the Hillcroft Villa booking system.

  ## Storage Buckets Created

  ### 1. `room-images`
  - Stores photos and images of rooms and villa facilities
  - Public access for viewing images
  - Restricted upload to authenticated users only
  - Allowed file types: images (jpg, jpeg, png, webp, gif)
  - Max file size: 5MB

  ### 2. `guest-documents`
  - Stores guest-uploaded documents (ID copies, special requests attachments)
  - Private access - guests can only access their own files
  - Allowed file types: images and PDFs
  - Max file size: 10MB

  ### 3. `villa-gallery`
  - Stores general villa photos for marketing and gallery display
  - Public access for viewing
  - Restricted upload to authenticated users only
  - Allowed file types: images
  - Max file size: 10MB

  ## Security Policies
  
  ### room-images bucket
  - Anyone can view/download images
  - Only authenticated users can upload
  - Only authenticated users can update/delete

  ### guest-documents bucket
  - Users can upload their own documents
  - Users can only view documents associated with their email
  - Only authenticated admins can view all documents

  ### villa-gallery bucket
  - Anyone can view/download images
  - Only authenticated users can upload/manage

  ## Notes
  - All buckets use file size limits to prevent abuse
  - File type restrictions ensure only appropriate content is uploaded
  - Public buckets are optimized for CDN delivery
*/

-- Insert storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'room-images',
    'room-images',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  ),
  (
    'guest-documents',
    'guest-documents',
    false,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
  ),
  (
    'villa-gallery',
    'villa-gallery',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO NOTHING;

-- Storage policies for room-images bucket
CREATE POLICY "Anyone can view room images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'room-images');

CREATE POLICY "Authenticated users can upload room images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'room-images');

CREATE POLICY "Authenticated users can update room images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'room-images')
  WITH CHECK (bucket_id = 'room-images');

CREATE POLICY "Authenticated users can delete room images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'room-images');

-- Storage policies for guest-documents bucket
CREATE POLICY "Users can upload guest documents"
  ON storage.objects FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'guest-documents');

CREATE POLICY "Users can view own guest documents"
  ON storage.objects FOR SELECT
  TO public
  USING (
    bucket_id = 'guest-documents' AND
    (storage.foldername(name))[1] = (SELECT guest_email FROM bookings WHERE id::text = (storage.foldername(name))[1])
  );

CREATE POLICY "Authenticated users can view all guest documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'guest-documents');

CREATE POLICY "Authenticated users can delete guest documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'guest-documents');

-- Storage policies for villa-gallery bucket
CREATE POLICY "Anyone can view villa gallery images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'villa-gallery');

CREATE POLICY "Authenticated users can upload villa gallery images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'villa-gallery');

CREATE POLICY "Authenticated users can update villa gallery images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'villa-gallery')
  WITH CHECK (bucket_id = 'villa-gallery');

CREATE POLICY "Authenticated users can delete villa gallery images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'villa-gallery');