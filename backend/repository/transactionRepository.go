package repository

import (
	"database/sql"
	"tokopeida-backend/model"
)

type TransactionRepository struct {
	dbPool *sql.DB
}

func NewTransactionRepository(dbPool *sql.DB) *TransactionRepository {
	return &TransactionRepository{
		dbPool: dbPool,
	}
}

func (r *TransactionRepository) scanRow(row *sql.Row) (model.Transaction, error) {
	var transaction model.Transaction

	return transaction, row.Scan(
		&transaction.ID,
		&transaction.UserEmail,
		&transaction.ProductID,
		&transaction.Quantity,
		&transaction.CreatedAt,
	)
}

func (r *TransactionRepository) scanRows(rows *sql.Rows) ([]model.Transaction, error) {
	var transactions []model.Transaction

	for rows.Next() {
		var transaction model.Transaction

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

func (r *TransactionRepository) scanRowsJoinProduct(rows *sql.Rows) ([]model.Transaction, error) {
	var transactions []model.Transaction

	for rows.Next() {
		var transaction model.Transaction

		if err := rows.Scan(
			&transaction.ID,
			&transaction.UserEmail,
			&transaction.Quantity,
			&transaction.CreatedAt,
			&transaction.Product.ID,
			&transaction.Product.Name,
			&transaction.Product.StoreID,
			&transaction.Product.Description,
			&transaction.Product.Stock,
			&transaction.Product.Price,
			&transaction.Product.CreatedAt,
			&transaction.Product.UpdatedAt,
		); err != nil {
			return transactions, err
		}

		transactions = append(transactions, transaction)
	}

	return transactions, nil
}

func (r *TransactionRepository) scanRowsJoinProductJoinImage(rows *sql.Rows) ([]model.Transaction, error) {
	var transactions []model.Transaction

	for rows.Next() {
		var transaction model.Transaction
		var image sql.NullString

		if err := rows.Scan(
			&transaction.ID,
			&transaction.UserEmail,
			&transaction.Quantity,
			&transaction.CreatedAt,
			&transaction.Product.ID,
			&transaction.Product.Name,
			&transaction.Product.StoreID,
			&transaction.Product.Description,
			&transaction.Product.Stock,
			&transaction.Product.Price,
			&transaction.Product.CreatedAt,
			&transaction.Product.UpdatedAt,
			&image,
		); err != nil {
			return transactions, err
		}

		exist := false
		if image.Valid {
			for i, t := range transactions {
				if t.ID == transaction.ID {
					transactions[i].Product.Images = append(transactions[i].Product.Images, image.String)
					exist = true
					break
				}
			}
		}

		if !exist {
			if image.Valid {
				transaction.Product.Images = append(transaction.Product.Images, image.String)
			}
			transactions = append(transactions, transaction)
		}
	}

	return transactions, nil
}

func (r *TransactionRepository) Create(transacrtion model.Transaction) (model.Transaction, error) {
	sql := `INSERT INTO transactions (user_email, product_id, quantity) 
	VALUES ($1, $2, $3) 
	RETURNING id, user_email, product_id, quantity, created_at`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		transacrtion.UserEmail,
		transacrtion.ProductID,
		transacrtion.Quantity,
	))
}

func (r *TransactionRepository) CreateWithTransaction(transacrtion model.Transaction, tx *sql.Tx) (model.Transaction, error) {
	sql := `INSERT INTO transactions (user_email, product_id, quantity) 
	VALUES ($1, $2, $3) 
	RETURNING id, user_email, product_id, quantity, created_at`

	return r.scanRow(tx.QueryRow(
		sql,
		transacrtion.UserEmail,
		transacrtion.ProductID,
		transacrtion.Quantity,
	))
}

func (r *TransactionRepository) GetAll() ([]model.Transaction, error) {
	sql := `SELECT id, user_email, product_id, quantity, created_at 
	FROM transactions`

	rows, err := r.dbPool.Query(sql)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRows(rows)
}

func (r *TransactionRepository) GetByID(id string) (model.Transaction, error) {
	sql := `SELECT id, user_email, product_id, quantity, created_at
	FROM transactions
	WHERE id = $1`

	return r.scanRow(r.dbPool.QueryRow(
		sql,
		id,
	))
}

func (r *TransactionRepository) GetAllByUserEmail(email string) ([]model.Transaction, error) {
	sql := `SELECT id, user_email, product_id, quantity, created_at
	FROM transactions
	WHERE user_email = $1`

	rows, err := r.dbPool.Query(sql, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRows(rows)
}

func (r *TransactionRepository) GetAllByUserEmailJoinProduct(email string) ([]model.Transaction, error) {
	sql := `SELECT t.id, user_email, quantity, t.created_at, p.id, p.name, 
	p.store_id, p.description, p.stock, p.price, p.created_at, p.updated_at, pi.file_name
	FROM transactions t
	INNER JOIN products p ON t.product_id = p.id
	LEFT JOIN product_images pi ON pi.product_id = p.id
	WHERE user_email = $1
	ORDER BY t.created_at DESC`

	rows, err := r.dbPool.Query(sql, email)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRowsJoinProductJoinImage(rows)
}

func (r *TransactionRepository) GetAllByStoreIDJoinProduct(storeID string) ([]model.Transaction, error) {
	sql := `SELECT t.id, user_email, quantity, t.created_at, p.id, p.name, 
	p.store_id, p.description, p.stock, p.price, p.created_at, p.updated_at, pi.file_name
	FROM transactions t
	INNER JOIN products p ON t.product_id = p.id
	LEFT JOIN product_images pi ON pi.product_id = p.id
	WHERE p.store_id = $1
	ORDER BY t.created_at DESC`

	rows, err := r.dbPool.Query(sql, storeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	return r.scanRowsJoinProductJoinImage(rows)
}
