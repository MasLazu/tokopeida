package repository

import (
	"database/sql"
	"tokopeida-backend/model"
)

type StoreRepository struct {
	dbPool *sql.DB
}

func NewStoreRepository(dbPool *sql.DB) *StoreRepository {
	return &StoreRepository{
		dbPool: dbPool,
	}
}

func (r *StoreRepository) scanRow(row *sql.Row) (model.Store, error) {
	var store model.Store
	return store, row.Scan(
		&store.ID,
		&store.OwnerEmail,
		&store.Name,
		&store.City,
		&store.CreatedAt,
		&store.UpdatedAt,
	)
}

func (r *StoreRepository) scanRows(rows *sql.Rows) ([]model.Store, error) {
	var stores []model.Store

	for rows.Next() {
		var store model.Store

		if err := rows.Scan(
			&store.ID,
			&store.OwnerEmail,
			&store.Name,
			&store.City,
			&store.CreatedAt,
			&store.UpdatedAt,
		); err != nil {
			return stores, err
		}

		stores = append(stores, store)
	}

	return stores, nil
}

func (r *StoreRepository) Create(store model.Store) (model.Store, error) {
	sql := `INSERT INTO stores (owner_email, name, city) VALUES ($1, $2, $3) RETURNING id, owner_email, name, city, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		store.OwnerEmail,
		store.Name,
		store.City,
	))
}

func (r *StoreRepository) GetAll() ([]model.Store, error) {
	var stores []model.Store
	sql := `SELECT id, owner_email, name, city, created_at, updated_at FROM stores`

	rows, err := r.dbPool.Query(sql)
	if err != nil {
		return stores, err
	}
	defer rows.Close()

	return r.scanRows(rows)
}

func (r *StoreRepository) GetByID(id string) (model.Store, error) {
	sql := `SELECT id, owner_email, name, city, created_at, updated_at 
	FROM stores 
	WHERE id = $1`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		id,
	))
}

func (r *StoreRepository) GetByOwnerEmail(ownerEmail string) (model.Store, error) {
	sql := `SELECT id, owner_email, name, city, created_at, updated_at 
	FROM stores 
	WHERE owner_email = $1`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		ownerEmail,
	))
}

func (r *StoreRepository) UpdateByOwnerEmail(store model.Store) (model.Store, error) {
	sql := `UPDATE stores SET name = $1 
	WHERE owner_email = $2 
	RETURNING id, owner_email, name, city, created_at, updated_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		store.Name,
		store.OwnerEmail,
	))
}
