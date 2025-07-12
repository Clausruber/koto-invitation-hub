
-- Add public_qr_url column to invitations table
ALTER TABLE public.invitations ADD COLUMN public_qr_url TEXT;

-- Create storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('qr-codes', 'qr-codes', true);

-- Create storage policies for the QR codes bucket
CREATE POLICY "Anyone can view QR codes" ON storage.objects
FOR SELECT USING (bucket_id = 'qr-codes');

CREATE POLICY "Authenticated users can upload QR codes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'qr-codes' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own QR codes" ON storage.objects
FOR UPDATE USING (bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own QR codes" ON storage.objects
FOR DELETE USING (bucket_id = 'qr-codes' AND auth.uid()::text = (storage.foldername(name))[1]);
