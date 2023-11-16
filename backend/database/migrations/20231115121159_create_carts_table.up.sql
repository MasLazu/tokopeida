-- Add up migration script here
CREATE TABLE carts (
    user_email VARCHAR(255) NOT NULL REFERENCES users(email),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INT NOT NULL,
    CONSTRAINT pkey_carts PRIMARY KEY (user_email, product_id)
);