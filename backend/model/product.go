package model

import (
	"database/sql"
	"mime/multipart"
	"time"
)

type Product struct {
	ID          string     `json:"id,omitempty"`
	Name        string     `json:"name,omitempty"`
	StoreID     string     `json:"store_id,omitempty"`
	Description string     `json:"description,omitempty"`
	Stock       int        `json:"stock,omitempty"`
	Price       int64      `json:"price,omitempty"`
	Images      []string   `json:"images,omitempty"`
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

func (p *Product) scanRowJoinProductImage(rows *sql.Rows) error {
	var product Product

	for rows.Next() {
		var p Product
		var image sql.NullString

		if err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.StoreID,
			&p.Description,
			&p.Stock,
			&p.Price,
			&p.CreatedAt,
			&p.UpdatedAt,
			&image,
		); err != nil {
			return err
		}

		if image.Valid {
			product.Images = append(product.Images, image.String)
			break
		}
	}
	return nil
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

func scanRowsProductJoinProductImage(rows *sql.Rows) ([]Product, error) {
	var products []Product

	for rows.Next() {
		var product Product
		var image sql.NullString

		if err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.StoreID,
			&product.Description,
			&product.Stock,
			&product.Price,
			&product.CreatedAt,
			&product.UpdatedAt,
			&image,
		); err != nil {
			return products, err
		}

		exist := false
		if image.Valid {
			for i, p := range products {
				if p.ID == product.ID {
					products[i].Images = append(products[i].Images, image.String)
					exist = true
					break
				}
			}
		}

		if !exist {
			if image.Valid {
				product.Images = append(product.Images, image.String)
			}
			products = append(products, product)
		}
	}

	return products, nil
}

type ProductCreate struct {
	Name        string                  `json:"name" validate:"required"`
	Description string                  `json:"description" validate:"required"`
	Stock       int                     `json:"stock" validate:"required"`
	Price       int64                   `json:"price" validate:"required"`
	Images      []*multipart.FileHeader `json:"_"`
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

func GetAllProductJoinProductImage(dbConn DBConn) ([]Product, error) {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at, file_name
	FROM products
	LEFT JOIN product_images ON products.id = product_images.product_id`

	rows, err := dbConn.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanRowsProductJoinProductImage(rows)
}

func GetAllWishlistProductByUserEmail(dbConn DBConn, email string) ([]Product, error) {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at 
	FROM wishlists 
	INNER JOIN products ON wishlists.product_id = products.id
	WHERE user_email = $1`
	rows, err := dbConn.Query(sql, email)
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
