-- Add up migration script here
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL REFERENCES users(email),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);