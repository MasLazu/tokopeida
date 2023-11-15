package model

import "database/sql"

type Wishlist struct {
	UserEmail string `json:"user_email"`
	ProductID string `json:"product_id"`
}

func (w *Wishlist) scanRow(row *sql.Row) error {
	return row.Scan(
		&w.UserEmail,
		&w.ProductID,
	)
}

func scanRowsWishlist(rows *sql.Rows) ([]Wishlist, error) {
	var wishlists []Wishlist

	for rows.Next() {
		var wishlist Wishlist

		if err := rows.Scan(
			&wishlist.UserEmail,
			&wishlist.ProductID,
		); err != nil {
			return wishlists, err
		}

		wishlists = append(wishlists, wishlist)
	}

	return wishlists, nil
}

func (w *Wishlist) Create(dbConn DBConn) error {
	sql := `INSERT INTO wishlists (user_email, product_id) VALUES ($1, $2) RETURNING user_email, product_id`

	return w.scanRow(dbConn.QueryRow(
		sql,
		w.UserEmail,
		w.ProductID,
	))
}

func (w *Wishlist) Delete(dbConn DBConn) error {
	sql := `DELETE FROM wishlists 
	WHERE product_id = $1 AND user_email = $2`

	if _, err := dbConn.Exec(
		sql,
		w.ProductID,
		w.UserEmail,
	); err != nil {
		return err
	}

	return nil
}

func GetAllByUserEmail(dbConn DBConn, email string) ([]Wishlist, error) {
	sql := `SELECT * FROM wishlists WHERE user_email = $1`
	rows, err := dbConn.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanRowsWishlist(rows)
}
