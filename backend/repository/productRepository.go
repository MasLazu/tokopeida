package repository

import (
	"database/sql"
	"tokopeida-backend/model"
)

type ProductRepository struct {
	dbPool *sql.DB
}

func NewProductRepository(dbPool *sql.DB) *ProductRepository {
	return &ProductRepository{
		dbPool: dbPool,
	}
}

func (r *ProductRepository) scanRow(row *sql.Row) (model.Product, error) {
	var product model.Product

	return product, row.Scan(
		&product.ID,
		&product.Name,
		&product.StoreID,
		&product.Description,
		&product.Stock,
		&product.Price,
		&product.CreatedAt,
		&product.UpdatedAt,
	)
}

func (r *ProductRepository) scanRowJoinProductImage(row *sql.Row) (model.Product, error) {
	var product model.Product
	var image sql.NullString

	if err := row.Scan(
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
		return product, err
	}

	if image.Valid {
		product.Images = append(product.Images, image.String)
	}

	return product, nil
}

func (r *ProductRepository) scanRows(rows *sql.Rows) ([]model.Product, error) {
	var products []model.Product

	for rows.Next() {
		var product model.Product

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

func (r *ProductRepository) scanRowsJoinProductImage(rows *sql.Rows) ([]model.Product, error) {
	var products []model.Product

	for rows.Next() {
		var product model.Product
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

func (r *ProductRepository) Create(product model.Product) (model.Product, error) {
	sql := `INSERT INTO products (name, store_id, description, stock, price)
	VALUES ($1, $2, $3, $4, $5)
	RETURNING id, name, store_id, description, stock, price, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		product.Name,
		product.StoreID,
		product.Description,
		product.Stock,
		product.Price,
	))
}

func (r *ProductRepository) Update(product model.Product) (model.Product, error) {
	sql := `UPDATE products SET name = $1, description = $2, stock = $3, price = $4
	WHERE id = $5
	RETURNING id, name, store_id, description, stock, price, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		product.Name,
		product.Description,
		product.Stock,
		product.Price,
		product.ID,
	))
}

func (r *ProductRepository) UpdateWithTransaction(product model.Product, tx *sql.Tx) (model.Product, error) {
	sql := `UPDATE products SET name = $1, description = $2, stock = $3, price = $4
	WHERE id = $5
	RETURNING id, name, store_id, description, stock, price, created_at, updated_at`

	return r.scanRow(tx.QueryRow(
		sql,
		product.Name,
		product.Description,
		product.Stock,
		product.Price,
		product.ID,
	))
}

func (r *ProductRepository) GetByID(id string) (model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at 
	FROM products 
	WHERE id = $1`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		id,
	))
}

func (r *ProductRepository) GetByIDJoinProductImage(id string) (model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at 
	FROM products 
	LEFT JOIN product_images ON products.id = product_images.product_id
	WHERE id = $1`

	return r.scanRowJoinProductImage(r.dbPool.QueryRow(
		sql,
		id,
	))
}

func (r *ProductRepository) GetAll() ([]model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at 
	FROM products`

	rows, err := r.dbPool.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRows(rows)
}

func (r *ProductRepository) GetAllJoinProductImage() ([]model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at, file_name
	FROM products
	LEFT JOIN product_images ON products.id = product_images.product_id`

	rows, err := r.dbPool.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRowsJoinProductImage(rows)
}

func (r *ProductRepository) GetAllWishlisProductByUserEmail(email string) ([]model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, price, created_at, updated_at 
	FROM wishlists 
	INNER JOIN products ON wishlists.product_id = products.id
	WHERE user_email = $1`

	rows, err := r.dbPool.Query(sql, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRows(rows)
}
