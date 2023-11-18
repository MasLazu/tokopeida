package repository

import (
	"database/sql"
	"tokopeida-backend/model"
)

type UserRepository struct {
	dbPool *sql.DB
}

func NewUserRepository(dbPool *sql.DB) *UserRepository {
	return &UserRepository{
		dbPool: dbPool,
	}
}

func (r *UserRepository) scanRow(row *sql.Row) (model.User, error) {
	var user model.User

	return user, row.Scan(
		&user.Email,
		&user.FirstName,
		&user.LastName,
		&user.Password,
		&user.Balance,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
}

func (r *UserRepository) scanRowsUser(rows *sql.Rows) ([]model.User, error) {
	var users []model.User

	for rows.Next() {
		var user model.User

		if err := rows.Scan(
			&user.Email,
			&user.FirstName,
			&user.LastName,
			&user.Password,
			&user.Balance,
			&user.CreatedAt,
			&user.UpdatedAt,
		); err != nil {
			return users, err
		}

		users = append(users, user)
	}

	return users, nil
}

func (r *UserRepository) Create(user model.User) (model.User, error) {
	sql := `INSERT INTO users (email, first_name, last_name, password) 
	VALUES ($1, $2, $3, $4) 
	RETURNING email, first_name, last_name, password, balance, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		user.Email,
		user.FirstName,
		user.LastName,
		user.Password,
	))
}

func (r *UserRepository) Update(user model.User) (model.User, error) {
	sql := `UPDATE users SET first_name = $1, last_name = $2
	WHERE email = $3
	RETURNING email, first_name, last_name, password, balance, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		user.FirstName,
		user.LastName,
		user.Email,
	))
}

func (r *UserRepository) UpdateBalance(user model.User) (model.User, error) {
	sql := `UPDATE users SET balance = $1
	WHERE email = $2
	RETURNING email, first_name, last_name, password, balance, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		user.Balance,
		user.Email,
	))
}

func (r *UserRepository) UpdateBalanceWithTransaction(user model.User, tx *sql.Tx) (model.User, error) {
	sql := `UPDATE users SET balance = $1
	WHERE email = $2
	RETURNING email, first_name, last_name, password, balance, created_at, updated_at`

	return r.scanRow(tx.QueryRow(
		sql,
		user.Balance,
		user.Email,
	))
}

func (r *UserRepository) GetByEmail(email string) (model.User, error) {
	sql := `SELECT email, first_name, last_name, password, balance, created_at, updated_at
	FROM users WHERE email = $1`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		email,
	))
}

func (r *UserRepository) GetAll() ([]model.User, error) {
	sql := `SELECT email, first_name, last_name, password, balance, created_at, updated_at FROM users`

	rows, err := r.dbPool.Query(sql)
	if err != nil {
		return []model.User{}, err
	}
	defer rows.Close()

	return r.scanRowsUser(rows)
}
