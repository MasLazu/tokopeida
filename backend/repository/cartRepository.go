package repository

import (
	"database/sql"
	"tokopeida-backend/model"
)

type CartRepository struct {
	dbPool *sql.DB
}

func NewCartRepository(dbPool *sql.DB) *CartRepository {
	return &CartRepository{
		dbPool: dbPool,
	}
}

func (r *CartRepository) scanRow(row *sql.Row) (model.Cart, error) {
	var cart model.Cart

	return cart, row.Scan(
		&cart.UserEmail,
		&cart.ProductID,
		&cart.Quantity,
	)
}

func (r *CartRepository) scanRowsJoinProduct(rows *sql.Rows) ([]model.Cart, error) {
	var cartResponses []model.Cart

	for rows.Next() {
		var cartResponse model.Cart

		if err := rows.Scan(
			&cartResponse.Product.ID,
			&cartResponse.Product.Name,
			&cartResponse.Product.StoreID,
			&cartResponse.Product.Description,
			&cartResponse.Product.Stock,
			&cartResponse.Product.Price,
			&cartResponse.Product.CreatedAt,
			&cartResponse.Product.UpdatedAt,
			&cartResponse.Quantity,
		); err != nil {
			return cartResponses, err
		}

		cartResponses = append(cartResponses, cartResponse)
	}

	return cartResponses, nil
}

func (r *CartRepository) scanRowsJoinProductJoinProductImages(rows *sql.Rows) ([]model.Cart, error) {
	var cartResponses []model.Cart

	for rows.Next() {
		var cartResponse model.Cart
		var image sql.NullString

		if err := rows.Scan(
			&cartResponse.Product.ID,
			&cartResponse.Product.Name,
			&cartResponse.Product.StoreID,
			&cartResponse.Product.Description,
			&cartResponse.Product.Stock,
			&cartResponse.Product.Price,
			&cartResponse.Product.CreatedAt,
			&cartResponse.Product.UpdatedAt,
			&cartResponse.Quantity,
			&image,
		); err != nil {
			return cartResponses, err
		}

		exist := false
		if image.Valid {
			for i, p := range cartResponses {
				if p.Product.ID == cartResponse.Product.ID {
					cartResponses[i].Product.Images = append(cartResponses[i].Product.Images, image.String)
					exist = true
					break
				}
			}
		}

		if !exist {
			if image.Valid {
				cartResponse.Product.Images = append(cartResponse.Product.Images, image.String)
			}
			cartResponses = append(cartResponses, cartResponse)
		}
	}

	return cartResponses, nil
}

func (r *CartRepository) Create(cart model.Cart) (model.Cart, error) {
	sql := `INSERT INTO carts (user_email, product_id, quantity) 
	VALUES ($1, $2, $3) 
	RETURNING user_email, product_id, quantity`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		cart.UserEmail,
		cart.ProductID,
		cart.Quantity,
	))
}

func (r *CartRepository) Update(cart model.Cart) (model.Cart, error) {
	sql := `UPDATE carts 
	SET quantity = $1 
	WHERE product_id = $2 AND user_email = $3
	RETURNING user_email, product_id, quantity`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		cart.Quantity,
		cart.ProductID,
		cart.UserEmail,
	))
}

func (r *CartRepository) Delete(cart model.Cart) error {
	sql := `DELETE FROM carts 
	WHERE product_id = $1 AND user_email = $2`

	if _, err := r.dbPool.Exec(
		sql,
		cart.ProductID,
		cart.UserEmail,
	); err != nil {
		return err
	}

	return nil
}

func (r *CartRepository) GetAllByUserEmailJoinProductJoinProductImages(userEmail string) ([]model.Cart, error) {
	sql := `SELECT p.id, p.name, p.store_id, p.description, p.stock, p.price, p.created_at, p.updated_at, c.quantity, pi.file_name
	FROM carts c
	INNER JOIN products p ON p.id = c.product_id
	INNER JOIN product_images pi ON pi.product_id = p.id
	WHERE c.user_email = $1`

	rows, err := r.dbPool.Query(sql, userEmail)
	if err != nil {
		return []model.Cart{}, err
	}

	return r.scanRowsJoinProductJoinProductImages(rows)
}
