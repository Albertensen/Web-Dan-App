-- Izinkan pembacaan publik (anon & authenticated) untuk forum
ALTER TABLE IF EXISTS threads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read threads" ON threads;
CREATE POLICY "Allow public read threads" ON threads FOR SELECT USING (true);

ALTER TABLE IF EXISTS replies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read replies" ON replies;
CREATE POLICY "Allow public read replies" ON replies FOR SELECT USING (true);

ALTER TABLE IF EXISTS forum_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read categories" ON forum_categories;
CREATE POLICY "Allow public read categories" ON forum_categories FOR SELECT USING (true);
