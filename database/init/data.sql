CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role BOOLEAN DEFAULT FALSE
);

CREATE TABLE game_entries (
    game_entries_id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    answer VARCHAR(100) NOT NULL,
    points INTEGER DEFAULT 0,
    user_id INTEGER,
    is_multiplayer BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id) 
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
