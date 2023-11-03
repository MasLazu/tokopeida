-- Add up migration script here
CREATE TABLE refresh_tokens (
    token UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL REFERENCES users(email),
    expires_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 month'
);