package model

import (
	"database/sql"
	"time"
)

type RefreshToken struct {
	Token     string
	UserEmail string
	ExpiresAt *time.Time
}

func (r *RefreshToken) scanRow(row *sql.Row) error {
	return row.Scan(
		&r.Token,
		&r.UserEmail,
		&r.ExpiresAt,
	)
}

func (r *RefreshToken) Create(dbConn DBConn) error {
	sql := `INSERT INTO refresh_tokens (user_email)
	VALUES ($1)
	RETURNING token, user_email, expires_at`

	return r.scanRow(dbConn.QueryRow(
		sql,
		r.UserEmail,
	))
}

func (r *RefreshToken) GetByToken(dbConn DBConn) error {
	sql := `SELECT token, user_email, expires_at 
	FROM refresh_tokens 
	WHERE token = $1`

	return r.scanRow(dbConn.QueryRow(
		sql,
		r.Token,
	))
}

func (r *RefreshToken) Delete(dbConn DBConn) error {
	sql := `DELETE FROM refresh_tokens 
	WHERE token = $1`

	if _, err := dbConn.Exec(
		sql,
		r.Token,
	); err != nil {
		return err
	}

	return nil
}
