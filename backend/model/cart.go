package model

type Cart struct {
	ID        string `json:"id"`
	UserEmail string `json:"user_email"`
	ProductID string `json:"product_id"`
	Amount    int    `json:"amount"`
}
