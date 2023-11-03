package model

import (
	"database/sql"
	"time"
)

type Store struct {
	ID         string     `json:"id,omitempty"`
	OwnerEmail string     `json:"owner_email,omitempty"`
	Name       string     `json:"name,omitempty"`
	CreatedAt  *time.Time `json:"created_at,omitempty"`
	UpdatedAt  *time.Time `json:"updated_at,omitempty"`
}

func (s *Store) scanRow(row *sql.Row) error {
	return row.Scan(
		&s.ID,
		&s.OwnerEmail,
		&s.Name,
		&s.CreatedAt,
		&s.UpdatedAt,
	)
}

func scanRowsStore(rows *sql.Rows) ([]Store, error) {
	var stores []Store

	for rows.Next() {
		var store Store

		if err := rows.Scan(
			&store.ID,
			&store.OwnerEmail,
			&store.Name,
			&store.CreatedAt,
			&store.UpdatedAt,
		); err != nil {
			return stores, err
		}

		stores = append(stores, store)
	}

	return stores, nil
}

type StoreRegister struct {
	Name string `json:"name" validate:"required"`
}

func (s *StoreRegister) ToStore() Store {
	return Store{Name: s.Name}
}

func (s *Store) Create(dbConn DBConn) error {
	sql := `INSERT INTO stores (owner_email, name) VALUES ($1, $2) RETURNING id, owner_email, name, created_at, updated_at`

	return s.scanRow(dbConn.QueryRow(
		sql,
		s.OwnerEmail,
		s.Name,
	))
}

func GetAllStore(dbConn DBConn) ([]Store, error) {
	var stores []Store
	sql := `SELECT id, owner_email, name, created_at, updated_at FROM stores`

	rows, err := dbConn.Query(sql)
	if err != nil {
		return stores, err
	}
	defer rows.Close()

	return scanRowsStore(rows)
}

func (s *Store) GetByID(dbConn DBConn) error {
	sql := `SELECT id, owner_email, name, created_at, updated_at 
	FROM stores 
	WHERE id = $1`

	return s.scanRow(dbConn.QueryRow(
		sql,
		s.ID,
	))
}

func (s *Store) GetByOwnerEmail(dbConn DBConn) error {
	sql := `SELECT id, owner_email, name, created_at, updated_at 
	FROM stores 
	WHERE owner_email = $1`

	return s.scanRow(dbConn.QueryRow(
		sql,
		s.OwnerEmail,
	))
}

func (s *Store) UpdateByOwnerEmail(dbConn *sql.DB) error {
	sql := `UPDATE stores SET name = $1 
	WHERE owner_email = $2 
	RETURNING id, owner_email, name, created_at, updated_at`

	return s.scanRow(dbConn.QueryRow(
		sql,
		s.Name,
		s.OwnerEmail,
	))
}
