--Tabelle für Benutzer, mit email, username, Passwort-Hash und Rolle (Admin/Normal)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role BOOLEAN DEFAULT FALSE
);

--Tabelle für Kategorien (z.B. Stadt, Land, Fluss, etc.) mit eindeutigen Namen
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL
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
    CONSTRAINT fk_category
        FOREIGN KEY(category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);
