package model

import "database/sql"

type Cart struct {
	UserEmail string `json:"user_email"`
	ProductID string `json:"product_id"`
	Quantity  int    `json:"quantity"`
}

type CartCreate struct {
	ProductID string `json:"product_id" validate:"required"`
	Quantity  int    `json:"quantity" validate:"required,number"`
}

type CartResponse struct {
	Product  Product `json:"product"`
	Quantity int     `json:"quantity"`
}

func scanRowsCartResponse(rows *sql.Rows) ([]CartResponse, error) {
	var cartResponses []CartResponse

	for rows.Next() {
		var cartResponse CartResponse

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

func GetAllCartByEmail(dbConn DBConn, userEmail string) ([]CartResponse, error) {
	sql := `SELECT p.id, p.name, p.store_id, p.description, p.stock, p.price, p.created_at, p.updated_at, c.quantity
	FROM carts c
	INNER JOIN products p ON p.id = c.product_id
	WHERE c.user_email = $1`

	rows, err := dbConn.Query(sql, userEmail)
	if err != nil {
		return []CartResponse{}, err
	}

	return scanRowsCartResponse(rows)
}

func (c *CartCreate) ToCart() Cart {
	return Cart{
		ProductID: c.ProductID,
		Quantity:  c.Quantity,
	}
}

func (c *Cart) scanRow(row *sql.Row) error {
	return row.Scan(
		&c.UserEmail,
		&c.ProductID,
		&c.Quantity,
	)
}

func (c *Cart) Create(dbConn DBConn) error {
	sql := `INSERT INTO carts (user_email, product_id, quantity) 
	VALUES ($1, $2, $3) 
	RETURNING user_email, product_id, quantity`

	return c.scanRow(dbConn.QueryRow(
		sql,
		c.UserEmail,
		c.ProductID,
		c.Quantity,
	))
}

func (c *Cart) Update(dbConn DBConn) error {
	sql := `UPDATE carts 
	SET quantity = $1 returning user_email, product_id, quantity`

	return c.scanRow(dbConn.QueryRow(
		sql,
		c.Quantity,
	))
}

func (c *Cart) Delete(dbConn DBConn) error {
	sql := `DELETE FROM carts 
	WHERE product_id = $1 AND user_email = $2`

	if _, err := dbConn.Exec(
		sql,
		c.ProductID,
		c.UserEmail,
	); err != nil {
		return err
	}

	return nil
}
