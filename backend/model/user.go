package model

import (
	"database/sql"
	"time"
)

type User struct {
	Email     string     `json:"email,omitempty"`
	FirstName string     `json:"first_name,omitempty"`
	LastName  string     `json:"last_name,omitempty"`
	Password  string     `json:"-"`
	Balance   int64      `json:"balance"`
	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

func (u *User) scanRow(row *sql.Row) error {
	return row.Scan(
		&u.Email,
		&u.FirstName,
		&u.LastName,
		&u.Password,
		&u.Balance,
		&u.CreatedAt,
		&u.UpdatedAt,
	)
}

func scanRowsUser(rows *sql.Rows) ([]User, error) {
	var users []User

	for rows.Next() {
		var user User

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

type UserLogin struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func (u *UserLogin) ToUser() User {
	return User{
		Email:    u.Email,
		Password: u.Password,
	}
}

type UserRegister struct {
	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Password  string `json:"password" validate:"required"`
}

func (u *UserRegister) ToUser() User {
	return User{
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Password:  u.Password,
	}
}

type UserUpdate struct {
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
}

func (u *UserUpdate) ToUser() User {
	return User{
		FirstName: u.FirstName,
		LastName:  u.LastName,
	}
}

func (u *User) Create(dbConn DBConn) error {
	sql := `INSERT INTO users (email, first_name, last_name, password) 
	VALUES ($1, $2, $3, $4) 
	RETURNING email, first_name, last_name, password, balance, created_at, updated_at`

	return u.scanRow(dbConn.QueryRow(
		sql,
		u.Email,
		u.FirstName,
		u.LastName,
		u.Password,
	))
}

func (u *User) Update(dbConn DBConn) error {
	sql := `UPDATE users SET first_name = $1, last_name = $2
	WHERE email = $3
	RETURNING email, first_name, last_name, password, balance, created_at, updated_at`

	return u.scanRow(dbConn.QueryRow(
		sql,
		u.FirstName,
		u.LastName,
		u.Email,
	))
}

func (u *User) UpdateBalance(dbConn DBConn) error {
	sql := `UPDATE users SET balance = $1
	WHERE email = $2
	RETURNING email, first_name, last_name, password, balance, created_at, updated_at`

	return u.scanRow(dbConn.QueryRow(
		sql,
		u.Balance,
		u.Email,
	))
}

func (u *User) GetByEmail(dbConn DBConn) error {
	sql := `SELECT email, first_name, last_name, password, balance, created_at, updated_at
	FROM users WHERE email = $1`

	return u.scanRow(dbConn.QueryRow(
		sql,
		u.Email,
	))
}

func GetAllUsers(dnConn DBConn) ([]User, error) {
	var users []User
	sql := `SELECT email, first_name, last_name, password, balance, created_at, updated_at FROM users`

	rows, err := dnConn.Query(sql)
	if err != nil {
		return users, err
	}
	defer rows.Close()

	return scanRowsUser(rows)
}
