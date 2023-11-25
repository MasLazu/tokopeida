package model

import (
	"time"
)

type Transaction struct {
	ID        string     `json:"id,omitempty"`
	UserEmail string     `json:"user_email,omitempty"`
	ProductID string     `json:"product_id,omitempty"`
	Product   Product    `json:"product,omitempty"`
	Quantity  int        `json:"quantity,omitempty"`
	CreatedAt *time.Time `json:"created_at,omitempty"`
}

type MultipleTransactionCreate struct {
	Transactions []TransactionCreate `json:"transactions" validate:"required"`
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
