-- Enable Row Level Security on all tables
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "account" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "verification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Public read policy for public boards
CREATE POLICY "Allow public read on public boards" ON boards
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

-- Public read policy for items belonging to public boards
CREATE POLICY "Allow public read on items in public boards" ON items
  FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM boards
    WHERE boards.id = items.board_id AND boards.is_public = true
  ));

-- Explicit deny policies on auth tables for public PostgREST roles (anon / authenticated)
CREATE POLICY "Deny public API access to users" ON "user"
  FOR ALL TO anon, authenticated
  USING (false);

CREATE POLICY "Deny public API access to sessions" ON "session"
  FOR ALL TO anon, authenticated
  USING (false);

CREATE POLICY "Deny public API access to accounts" ON "account"
  FOR ALL TO anon, authenticated
  USING (false);

CREATE POLICY "Deny public API access to verifications" ON "verification"
  FOR ALL TO anon, authenticated
  USING (false);
