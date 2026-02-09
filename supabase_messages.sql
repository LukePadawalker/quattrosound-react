-- Create contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    event_type TEXT,
    date DATE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public contact form)
CREATE POLICY "Allow anonymous inserts" ON public.contact_messages
    FOR INSERT WITH CHECK (true);

-- Allow authenticated admins to select and update (mark as read)
CREATE POLICY "Allow admins to manage messages" ON public.contact_messages
    FOR ALL USING (auth.role() = 'authenticated');
