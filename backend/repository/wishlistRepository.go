package repository

import (
	"database/sql"
	"tokopeida-backend/model"
)

type WishlistRepository struct {
	dbPool *sql.DB
}

func NewWishlistRepository(dbPool *sql.DB) *WishlistRepository {
	return &WishlistRepository{
		dbPool: dbPool,
	}
}

func (r *WishlistRepository) scanRow(row *sql.Row) (model.Wishlist, error) {
	var wishlist model.Wishlist

	return wishlist, row.Scan(
		&wishlist.UserEmail,
		&wishlist.ProductID,
	)
}

func (r *WishlistRepository) scanRows(rows *sql.Rows) ([]model.Wishlist, error) {
	var wishlists []model.Wishlist

	for rows.Next() {
		var wishlist model.Wishlist

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

func (r *WishlistRepository) Create(wishlist model.Wishlist) (model.Wishlist, error) {
	sql := `INSERT INTO wishlists (user_email, product_id) VALUES ($1, $2) RETURNING user_email, product_id`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		wishlist.UserEmail,
		wishlist.ProductID,
	))
}

func (r *WishlistRepository) Delete(wishlist model.Wishlist) error {
	sql := `DELETE FROM wishlists 
	WHERE product_id = $1 AND user_email = $2`

	if _, err := r.dbPool.Exec(
		sql,
		wishlist.ProductID,
		wishlist.UserEmail,
	); err != nil {
		return err
	}

	return nil
}

func (r *WishlistRepository) GetAlByUserEmail(email string) ([]model.Wishlist, error) {
	sql := `SELECT * FROM wishlists WHERE user_email = $1`
	rows, err := r.dbPool.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRows(rows)
}
