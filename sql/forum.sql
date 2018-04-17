DROP TABLE IF EXISTS forum;

CREATE TABLE forum (
    topic_id SERIAL PRIMARY KEY,
    message VARCHAR(333),
    created_at TIMESTAMP,
    user_id INTEGER UNIQUE REFERENCES users(id)
)
