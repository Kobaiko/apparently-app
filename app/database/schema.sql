-- Apparently Co-Parenting App Database Schema
-- This schema supports multi-co-parenting relationships as specified in the PRD

-- Create custom types
CREATE TYPE user_role AS ENUM ('parent', 'admin');
CREATE TYPE relationship_type AS ENUM ('primary', 'secondary', 'guardian', 'stepparent');
CREATE TYPE message_type AS ENUM ('text', 'image', 'document', 'system');
CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
CREATE TYPE event_type AS ENUM ('pickup', 'dropoff', 'school', 'activity', 'medical', 'other');

-- Users table (extends auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  date_of_birth DATE,
  address JSONB, -- {street, city, state, zip, country}
  role user_role DEFAULT 'parent',
  is_active BOOLEAN DEFAULT TRUE,
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Children table
CREATE TABLE children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  avatar_url TEXT,
  medical_info JSONB, -- allergies, medications, conditions
  school_info JSONB, -- school name, grade, teacher
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Co-parent relationships (many-to-many between users and children)
CREATE TABLE co_parents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  relationship_type relationship_type NOT NULL,
  custody_percentage DECIMAL(5,2) DEFAULT 50.00, -- percentage of custody time
  permissions JSONB, -- array of permission strings
  is_primary BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, child_id)
);

-- Messages table for communication
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  message_type message_type DEFAULT 'text',
  content TEXT,
  attachments JSONB, -- array of file URLs/metadata
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  is_urgent BOOLEAN DEFAULT FALSE,
  parent_message_id UUID REFERENCES messages(id), -- for threaded conversations
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table for shared cost tracking
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  payer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  category VARCHAR(100) NOT NULL, -- medical, education, clothing, activities, etc.
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  expense_date DATE NOT NULL,
  status expense_status DEFAULT 'pending',
  receipts JSONB, -- array of receipt URLs
  split_details JSONB, -- how expense is split between co-parents
  notes TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule events for custody calendar
CREATE TABLE schedule_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  responsible_parent_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  event_type event_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern JSONB, -- for recurring events
  is_confirmed BOOLEAN DEFAULT FALSE,
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table for file storage references
CREATE TABLE documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  document_type VARCHAR(100) NOT NULL, -- medical, legal, school, photos, etc.
  title VARCHAR(200) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_confidential BOOLEAN DEFAULT FALSE,
  accessible_to JSONB, -- array of user IDs who can access
  tags JSONB, -- array of tag strings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_co_parents_user_id ON co_parents(user_id);
CREATE INDEX idx_co_parents_child_id ON co_parents(child_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_child_id ON messages(child_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_expenses_child_id ON expenses(child_id);
CREATE INDEX idx_expenses_payer_id ON expenses(payer_id);
CREATE INDEX idx_schedule_events_child_id ON schedule_events(child_id);
CREATE INDEX idx_schedule_events_start_time ON schedule_events(start_time);
CREATE INDEX idx_documents_child_id ON documents(child_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE co_parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Co-parents can only see children they are connected to
CREATE POLICY "Co-parents can view their children" ON children FOR SELECT 
USING (id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

CREATE POLICY "Co-parents can update their children" ON children FOR UPDATE 
USING (id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

-- Co-parents table policies
CREATE POLICY "Users can view their co-parent relationships" ON co_parents FOR SELECT 
USING (user_id = auth.uid() OR child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

-- Messages policies - can see messages for children they co-parent
CREATE POLICY "Co-parents can view messages for their children" ON messages FOR SELECT 
USING (child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

CREATE POLICY "Co-parents can send messages for their children" ON messages FOR INSERT 
WITH CHECK (sender_id = auth.uid() AND child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

-- Expenses policies
CREATE POLICY "Co-parents can view expenses for their children" ON expenses FOR SELECT 
USING (child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

CREATE POLICY "Co-parents can create expenses for their children" ON expenses FOR INSERT 
WITH CHECK (payer_id = auth.uid() AND child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

-- Schedule events policies
CREATE POLICY "Co-parents can view schedule for their children" ON schedule_events FOR SELECT 
USING (child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

CREATE POLICY "Co-parents can create schedule events for their children" ON schedule_events FOR INSERT 
WITH CHECK (responsible_parent_id = auth.uid() AND child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

-- Documents policies
CREATE POLICY "Co-parents can view documents for their children" ON documents FOR SELECT 
USING (child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

CREATE POLICY "Co-parents can upload documents for their children" ON documents FOR INSERT 
WITH CHECK (uploaded_by = auth.uid() AND child_id IN (SELECT child_id FROM co_parents WHERE user_id = auth.uid()));

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_co_parents_updated_at BEFORE UPDATE ON co_parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedule_events_updated_at BEFORE UPDATE ON schedule_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 