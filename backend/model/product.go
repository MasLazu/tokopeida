package model

import (
	"database/sql"
	"time"
)

type Product struct {
	ID          string     `json:"id,omitempty"`
	Name        string     `json:"name,omitempty"`
	StoreID     string     `json:"store_id,omitempty"`
	Description string     `json:"description,omitempty"`
	Stock       int        `json:"stock,omitempty"`
	Price       int64      `json:"price,omitempty"`
	CreatedAt   *time.Time `json:"created_at,omitempty"`
	UpdatedAt   *time.Time `json:"updated_at,omitempty"`
}

func (p *Product) scanRow(row *sql.Row) error {
	return row.Scan(
		&p.ID,
		&p.Name,
		&p.StoreID,
		&p.Description,
		&p.Stock,
		&p.Price,
		&p.CreatedAt,
		&p.UpdatedAt,
	)
}

func scanRowsProduct(rows *sql.Rows) ([]Product, error) {
	var products []Product

	for rows.Next() {
		var product Product

		if err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.StoreID,
			&product.Description,
			&product.Stock,
			&product.Price,
			&product.CreatedAt,
			&product.UpdatedAt,
		); err != nil {
			return products, err
		}

		products = append(products, product)
	}

	return products, nil
}

type ProductCreate struct {
	Name        string `json:"name" validate:"required"`
	Description string `json:"description" validate:"required"`
	Stock       int    `json:"stock" validate:"required"`
	Price       int64  `json:"price" validate:"required"`
}

func (p *ProductCreate) ToProduct() Product {
	return Product{
		Name:        p.Name,
		Description: p.Description,
		Stock:       p.Stock,
		Price:       p.Price,
	}
}

type ProductUpdate struct {
	ID          string `json:"id" validate:"required"`
	Name        string `json:"name" validate:"required"`
	Description string `json:"description" validate:"required"`
	Stock       int    `json:"stock" validate:"required"`
	Price       int64  `json:"price" validate:"required"`
}

func (p *ProductUpdate) ToProduct() Product {
	return Product{
		ID:          p.ID,
		Name:        p.Name,
		Description: p.Description,
		Stock:       p.Stock,
		Price:       p.Price,
	}
}

func GetAllProduct(dbConn DBConn) ([]Product, error) {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at 
	FROM products`

	rows, err := dbConn.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanRowsProduct(rows)
}

func (p *Product) Create(dbConn DBConn) error {
	sql := `INSERT INTO products (name, store_id, description, stock, price)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING id, name, store_id, description, stock, price, created_at, updated_at`

	return p.scanRow(dbConn.QueryRow(
		sql,
		p.Name,
		p.StoreID,
		p.Description,
		p.Stock,
		p.Price,
	))
}

func (p *Product) UpdateByID(dbConn DBConn) error {
	sql := `UPDATE products SET name = $1, description = $2, stock = $3, price = $4
	WHERE id = $5
	RETURNING id, name, store_id, description, stock, price, created_at, updated_at`

	return p.scanRow(dbConn.QueryRow(
		sql,
		p.Name,
		p.Description,
		p.Stock,
		p.Price,
		p.ID,
	))
}

func (p *Product) GetByID(dbConn DBConn) error {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at 
	FROM products 
	WHERE id = $1`

	return p.scanRow(dbConn.QueryRow(
		sql,
		p.ID,
	))
}
