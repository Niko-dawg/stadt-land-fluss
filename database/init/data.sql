--Tabelle für Benutzer, mit email, username, Passwort-Hash und Rolle (Admin/Normal)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

--Tabelle für Kategorien (z.B. Stadt, Land, Fluss, etc.) mit eindeutigen Namen
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
);

--Tabelle für gültige Wörter, die einer Kategorie zugeordnet sind
--Fremdschlüssel zu categories
CREATE TABLE valid_words (
    word_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    word VARCHAR(100) NOT NULL,
    CONSTRAINT fk_category_valid
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

--Tabelle für Spieleinträge, die eine Antwort in einer bestimmten Kategorie für einen Benutzer speichern
--Fremdschlüssel zu users und categories, Punktewert und Multiplayer-Flag
CREATE TABLE game_entries (
    game_entries_id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    answer VARCHAR(100) NOT NULL,
    points INTEGER DEFAULT 0,
    user_id INTEGER,
    is_multiplayer BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category_entry
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);

-- Test-User für Development
-- Passwort für test@example.com: "password123"
-- Passwort für admin@example.com: "admin123"
INSERT INTO users (username, email, password_hash, is_admin) VALUES
('testuser', 'test@example.com', '$2a$10$B24142b/rrVBjHE.7veI9eH7TKheGKcb0n49fAoWMHGziecLDc0Gm', FALSE),
('admin', 'admin@example.com', '$2a$10$4tutlgU7y8k1zSPbGimq6uWT0R1RDD9ml8p/8EHS8jOYPJAGfhzMa', TRUE);
