package repository

import (
	"database/sql"
	"tokopeida-backend/model"
)

type RefreshTokenRepository struct {
	dbPool *sql.DB
}

func NewRefreshTokenRepository(dbPool *sql.DB) *RefreshTokenRepository {
	return &RefreshTokenRepository{
		dbPool: dbPool,
	}
}

func (r *RefreshTokenRepository) scanRow(row *sql.Row) (model.RefreshToken, error) {
	var refreshToken model.RefreshToken
	return refreshToken, row.Scan(
		&refreshToken.Token,
		&refreshToken.UserEmail,
		&refreshToken.ExpiresAt,
	)
}

func (r *RefreshTokenRepository) Create(refreshToken model.RefreshToken) (model.RefreshToken, error) {
	sql := `INSERT INTO refresh_tokens (user_email)
	VALUES ($1)
	RETURNING token, user_email, expires_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		refreshToken.UserEmail,
	))
}

func (r *RefreshTokenRepository) GetByToken(token string) (model.RefreshToken, error) {
	sql := `SELECT token, user_email, expires_at 
	FROM refresh_tokens 
	WHERE token = $1`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		token,
	))
}

func (r *RefreshTokenRepository) Delete(refreshToken model.RefreshToken) error {
	sql := `DELETE FROM refresh_tokens 
	WHERE token = $1`

	if _, err := r.dbPool.Exec(
		sql,
		refreshToken.Token,
	); err != nil {
		return err
	}

	return nil
}
