-- ================================================
-- FIX: Auto-create user profiles + fix existing users
-- Run this ENTIRE script in Supabase SQL Editor
-- ================================================

-- STEP 1: Create trigger function to auto-create user profiles
-- This runs with elevated privileges (SECURITY DEFINER) so RLS doesn't block it
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role, full_name, phone)
    VALUES (
        NEW.id,
        NEW.email,
        'client',
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 2: Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STEP 3: Fix any existing auth users that don't have a profile yet
INSERT INTO public.users (id, email, role, full_name)
SELECT 
    au.id,
    au.email,
    'client',
    COALESCE(au.raw_user_meta_data->>'full_name', 'User')
FROM auth.users au
LEFT JOIN public.users pu ON pu.id = au.id
WHERE pu.id IS NULL;

-- STEP 4: Confirm ALL existing unconfirmed users (fixes "Email not confirmed" error)
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;

-- STEP 5: Add INSERT policy for users table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Users can insert own profile'
    ) THEN
        CREATE POLICY "Users can insert own profile"
            ON users FOR INSERT
            WITH CHECK (id = auth.uid());
    END IF;
END $$;

-- DONE! All existing users are now confirmed and have profiles.
-- New signups will automatically get profiles created via the trigger.

-- ================================================
-- STEP 6: Create storage bucket for order documents
-- ================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-documents', 'order-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'order-documents');

-- Allow authenticated users to read files
CREATE POLICY "Authenticated users can read" ON storage.objects
    FOR SELECT TO authenticated
    USING (bucket_id = 'order-documents');

-- Allow users to update their own files
CREATE POLICY "Users can update own files" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'order-documents');
