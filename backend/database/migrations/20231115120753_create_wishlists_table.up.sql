-- Add up migration script here
CREATE TABLE wishlists (
    user_email VARCHAR(255) NOT NULL REFERENCES users(email),
    product_id UUID NOT NULL REFERENCES products(id),
    CONSTRAINT pkey_wishlists PRIMARY KEY (user_email, product_id)
);