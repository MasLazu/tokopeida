-- Add up migration script here
CREATE TABLE product_images (
    file_name TEXT PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id)
);