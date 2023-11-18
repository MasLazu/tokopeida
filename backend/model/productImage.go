package model

import "database/sql"

type ProductImage struct {
	FileName  string `json:"file_name,omitempty"`
	ProductID string `json:"product_id,omitempty"`
}

func (p *ProductImage) scanRow(row *sql.Row) error {
	return row.Scan(
		&p.FileName,
		&p.ProductID,
	)
}

func scanRowsProductImage(rows *sql.Rows) ([]ProductImage, error) {
	var productImages []ProductImage

	for rows.Next() {
		var productImage ProductImage

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

func (p *ProductImage) Create(dbConn DBConn) error {
	sql := `INSERT INTO product_images (file_name, product_id)
	VALUES ($1, $2)
	RETURNING file_name, product_id`

	return p.scanRow(dbConn.QueryRow(
		sql,
		p.FileName,
		p.ProductID,
	))
}

func GetProductImagesByProductID(dbConn DBConn, productID string) ([]ProductImage, error) {
	sql := `SELECT file_name, product_id
	FROM product_images
	WHERE product_id = $1`

	rows, err := dbConn.Query(sql, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanRowsProductImage(rows)
}
