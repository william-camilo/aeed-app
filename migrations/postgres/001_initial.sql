CREATE TABLE IF NOT EXISTS users (
 id text PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE,
 password_hash text NOT NULL, password_salt text NOT NULL,
 current_session_hash text, role text NOT NULL DEFAULT 'attendant',
 company_id text NOT NULL, created_at bigint NOT NULL,
 plan text NOT NULL DEFAULT 'individual', subscription_status text NOT NULL DEFAULT 'active'
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email));
CREATE TABLE IF NOT EXISTS sessions (
 id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 token_hash text NOT NULL UNIQUE, device_name text, browser text, ip_address text,
 created_at bigint NOT NULL, last_activity bigint NOT NULL,
 active integer NOT NULL DEFAULT 1, reason text
);
CREATE INDEX IF NOT EXISTS idx_sessions_user_active ON sessions(user_id,active);
CREATE TABLE IF NOT EXISTS analyses (
 id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 created_at bigint NOT NULL, situation text NOT NULL, channel text NOT NULL,
 message text NOT NULL, result text NOT NULL, favorite integer NOT NULL DEFAULT 0,
 copied integer NOT NULL DEFAULT 0, outcome text NOT NULL DEFAULT 'Em andamento'
);
CREATE INDEX IF NOT EXISTS idx_analyses_user_date ON analyses(user_id,created_at);
CREATE TABLE IF NOT EXISTS practices (
 id text PRIMARY KEY, user_id text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 created_at bigint NOT NULL, scenario text NOT NULL, answer text NOT NULL, review text NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_practices_user_date ON practices(user_id,created_at);
CREATE TABLE IF NOT EXISTS settings (
 user_id text PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, value text NOT NULL
);
