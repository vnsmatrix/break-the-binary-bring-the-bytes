DROP TABLE IF EXISTS user_profiles;

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    age INTEGER,
    city VARCHAR(333),
    url VARCHAR(333),
    bulletin BIT,
    user_id INTEGER UNIQUE REFERENCES users(id)
);
