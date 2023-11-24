-- Add up migration script here
ALTER TABLE products ADD COLUMN sold INT NOT NULL DEFAULT 0;