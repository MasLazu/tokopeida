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
		&product.Sold,
		&product.Price,
		&product.CreatedAt,
		&product.UpdatedAt,
	)
}

func (r *ProductRepository) scanRowJoinProductImage(rows *sql.Rows) (model.Product, error) {
	var product model.Product

	for rows.Next() {
		var image sql.NullString

		if err := rows.Scan(
			&product.ID,
			&product.Name,
			&product.StoreID,
			&product.Description,
			&product.Stock,
			&product.Sold,
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
			&product.Sold,
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
			&product.Sold,
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
	sql := `INSERT INTO products (name, store_id, description, stock, sold, price)
	VALUES ($1, $2, $3, $4, $5, $6)
	RETURNING id, name, store_id, description, stock, sold, price, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		product.Name,
		product.StoreID,
		product.Description,
		product.Stock,
		product.Sold,
		product.Price,
	))
}

func (r *ProductRepository) Update(product model.Product) (model.Product, error) {
	sql := `UPDATE products SET name = $1, description = $2, stock = $3, sold = $4, price = $5
	WHERE id = $6
	RETURNING id, name, store_id, description, stock, sold, price, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		product.Name,
		product.Description,
		product.Stock,
		product.Sold,
		product.Price,
		product.ID,
	))
}

func (r *ProductRepository) UpdateWithTransaction(product model.Product, tx *sql.Tx) (model.Product, error) {
	sql := `UPDATE products SET name = $1, description = $2, stock = $3, sold = $4, price = $5
	WHERE id = $6
	RETURNING id, name, store_id, description, stock, sold, price, created_at, updated_at`

	return r.scanRow(tx.QueryRow(
		sql,
		product.Name,
		product.Description,
		product.Stock,
		product.Sold,
		product.Price,
		product.ID,
	))
}

func (r *ProductRepository) GetByID(id string) (model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at 
	FROM products 
	WHERE id = $1`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		id,
	))
}

func (r *ProductRepository) GetByIDJoinProductImage(id string) (model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at, file_name
	FROM products 
	LEFT JOIN product_images ON products.id = product_images.product_id
	WHERE id = $1`

	rows, err := r.dbPool.Query(sql, id)
	if err != nil {
		return model.Product{}, err
	}
	defer rows.Close()

	return r.scanRowJoinProductImage(rows)
}

func (r *ProductRepository) GetAll() ([]model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at 
	FROM products`

	rows, err := r.dbPool.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRows(rows)
}

func (r *ProductRepository) GetAllJoinProductImage() ([]model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at, file_name
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
	sql := `SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at, file_name
	FROM wishlists 
	INNER JOIN products ON wishlists.product_id = products.id
	INNER JOIN product_images ON products.id = product_images.product_id
	WHERE user_email = $1`

	rows, err := r.dbPool.Query(sql, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRowsJoinProductImage(rows)
}

func (r *ProductRepository) GetAllByStoreIDJoinImage(storeID string) ([]model.Product, error) {
	sql := `SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at, file_name
	FROM products 
	LEFT JOIN product_images ON products.id = product_images.product_id
	WHERE store_id = $1`

	rows, err := r.dbPool.Query(sql, storeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRowsJoinProductImage(rows)
}

func (r *ProductRepository) GetRandomJoinImage(amount int) ([]model.Product, error) {
	sql := `WITH RandomProducts AS (
		SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at
		FROM products
		ORDER BY RANDOM()
		LIMIT $1
	),
	ProductsWithImages AS (
		SELECT p.id, p.name, p.store_id, p.description, p.stock, p.sold, p.price, p.created_at, p.updated_at, pi.file_name
		FROM RandomProducts p
		LEFT JOIN product_images pi ON p.id = pi.product_id
	)
	SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at, file_name
	FROM ProductsWithImages`

	rows, err := r.dbPool.Query(sql, amount)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRowsJoinProductImage(rows)
}

func (r *ProductRepository) SearchJoinImage(keyword string, limit int) ([]model.Product, error) {
	sql := `WITH Products AS (
		SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at
		FROM products
		WHERE to_tsvector('english', name) @@ plainto_tsquery('english', $1)
		ORDER BY ts_rank(to_tsvector('english', name), plainto_tsquery('english', $1)) DESC
		LIMIT $2
	),
	ProductsWithImages AS (
		SELECT p.id, p.name, p.store_id, p.description, p.stock, p.sold, p.price, p.created_at, p.updated_at, pi.file_name
		FROM Products p
		LEFT JOIN product_images pi ON p.id = pi.product_id
	)
	SELECT id, name, store_id, description, stock, sold, price, created_at, updated_at, file_name
	FROM ProductsWithImages`

	rows, err := r.dbPool.Query(sql, keyword, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRowsJoinProductImage(rows)
}
