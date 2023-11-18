package repository

import (
	"database/sql"
	"tokopeida-backend/model"
)

type ProductImageRepository struct {
	dbPool *sql.DB
}

func NewProductImageRepository(dbPool *sql.DB) *ProductImageRepository {
	return &ProductImageRepository{
		dbPool: dbPool,
	}
}

func (r *ProductImageRepository) scanRow(row *sql.Row) (model.ProductImage, error) {
	var productImage model.ProductImage

	return productImage, row.Scan(
		&productImage.FileName,
		&productImage.ProductID,
	)
}

func (r *ProductImageRepository) scanRows(rows *sql.Rows) ([]model.ProductImage, error) {
	var productImages []model.ProductImage

	for rows.Next() {
		var productImage model.ProductImage

		if err := rows.Scan(
			&productImage.FileName,
			&productImage.ProductID,
		); err != nil {
			return productImages, err
		}

		productImages = append(productImages, productImage)
	}

	return productImages, nil
}

func (r *ProductImageRepository) Create(productImage model.ProductImage) (model.ProductImage, error) {
	sql := `INSERT INTO product_images (file_name, product_id)
	VALUES ($1, $2)
	RETURNING file_name, product_id`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		productImage.FileName,
		productImage.ProductID,
	))
}

func (r *ProductImageRepository) GetByProductID(productID string) ([]model.ProductImage, error) {
	sql := `SELECT file_name, product_id
	FROM product_images
	WHERE product_id = $1`

	rows, err := r.dbPool.Query(sql, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRows(rows)
}
