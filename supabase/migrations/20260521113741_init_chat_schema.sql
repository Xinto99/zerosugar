-- Create chat_sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create chat_messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access
CREATE POLICY "Allow anonymous select on chat_sessions" ON chat_sessions FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on chat_sessions" ON chat_sessions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select on chat_messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert on chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);
