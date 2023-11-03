package model

import (
	"database/sql"
	"time"
)

type Transaction struct {
	ID        string     `json:"id,omitempty"`
	UserEmail string     `json:"user_email,omitempty"`
	ProductID string     `json:"product_id,omitempty"`
	Quantity  int        `json:"quantity,omitempty"`
	CreatedAt *time.Time `json:"created_at,omitempty"`
}

func (t *Transaction) scanRow(row *sql.Row) error {
	return row.Scan(
		&t.ID,
		&t.UserEmail,
		&t.ProductID,
		&t.Quantity,
		&t.CreatedAt,
	)
}

func scanRowsTransaction(rows *sql.Rows) ([]Transaction, error) {
	var transactions []Transaction

	for rows.Next() {
		var transaction Transaction

		if err := rows.Scan(
			&transaction.ID,
			&transaction.UserEmail,
			&transaction.ProductID,
			&transaction.Quantity,
			&transaction.CreatedAt,
		); err != nil {
			return transactions, err
		}

		transactions = append(transactions, transaction)
	}

	return transactions, nil
}

type TransactionCreate struct {
	ProductID string `json:"product_id" validate:"required"`
	Quantity  int    `json:"quantity" validate:"required"`
}

func (t *TransactionCreate) ToTransaction() Transaction {
	return Transaction{
		ProductID: t.ProductID,
		Quantity:  t.Quantity,
	}
}

func (t *Transaction) Create(dbConn DBConn) error {
	sql := `INSERT INTO transactions (user_email, product_id, quantity) 
	VALUES ($1, $2, $3) 
	RETURNING id, user_email, product_id, quantity, created_at`

	return t.scanRow(dbConn.QueryRow(
		sql,
		t.UserEmail,
		t.ProductID,
		t.Quantity,
	))
}

func GetAllTransaction(dbConn DBConn) ([]Transaction, error) {
	sql := `SELECT id, user_email, product_id, quantity, created_at 
	FROM transactions`

	rows, err := dbConn.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanRowsTransaction(rows)
}

func GetAllTransactionByUserEmail(dbConn DBConn, email string) ([]Transaction, error) {
	sql := `SELECT id, user_email, product_id, quantity, created_at
	FROM transactions`

	rows, err := dbConn.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return scanRowsTransaction(rows)
}

func (t *Transaction) GetByID(dbConn DBConn) error {
	sql := `SELECT id, user_email, product_id, quantity, created_at
	FROM transactions
	WHERE id = $1`

	return t.scanRow(dbConn.QueryRow(
		sql,
		t.ID,
	))
}
