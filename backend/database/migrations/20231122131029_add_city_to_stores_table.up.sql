-- Add up migration script here
ALTER TABLE stores ADD COLUMN city VARCHAR(255) NOT NULL DEFAULT '';