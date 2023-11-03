package service

import (
	"errors"
	"tokopeida-backend/database"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"

	"github.com/labstack/echo/v4"
)

var (
	ErrProductNotFound     = errors.New("Product not found")
	ErrInsufficientStock   = errors.New("Insufficient stock")
	ErrInsufficientBalance = errors.New("Insufficient balance")
	ErrBuyYourOwnProduct   = errors.New("Buy your own product")
	ErrDontHaveStore       = errors.New("Don't have a store")
	ErrDontOwnProduct      = errors.New("Don't own this product")
)

type ProductService struct {
	database    *database.Database
	authService *AuthService
}

func NewProductService(database *database.Database, auAuthService *AuthService) *ProductService {
	return &ProductService{
		database:    database,
		authService: auAuthService,
	}
}

func (s *ProductService) Buy(transactionRequest model.TransactionCreate, echoContext echo.Context) (model.Transaction, error) {
	var transaction model.Transaction
	user, err := s.authService.CurrentUser(echoContext)
	if err != nil {
		return transaction, err
	}

	product := model.Product{
		ID: transactionRequest.ProductID,
	}

	if err := product.GetByID(s.database.Conn); err != nil {
		return transaction, ErrProductNotFound
	}

	store := model.Store{ID: product.StoreID}
	if err := store.GetByID(s.database.Conn); err != nil {
		return transaction, err
	}

	if store.OwnerEmail == user.Email {
		return transaction, ErrBuyYourOwnProduct
	}

	if product.Stock < transactionRequest.Quantity {
		return transaction, ErrInsufficientStock
	}

	valueTransaction := product.Price * int64(transactionRequest.Quantity)

	if valueTransaction > user.Balance {
		return transaction, ErrInsufficientBalance
	}

	tx, err := s.database.Conn.Begin()
	if err != nil {
		return transaction, err
	}

	user.Balance -= valueTransaction
	if err := user.UpdateBalance(tx); err != nil {
		tx.Rollback()
		return transaction, err
	}

	transaction = transactionRequest.ToTransaction()
	transaction.UserEmail = user.Email

	if err := transaction.Create(tx); err != nil {
		tx.Rollback()
		return transaction, err
	}

	product.Stock -= transaction.Quantity
	if err := product.UpdateByID(tx); err != nil {
		tx.Rollback()
		return transaction, err
	}

	if err := tx.Commit(); err != nil {
		return transaction, err
	}

	return transaction, nil
}

func (s *ProductService) Create(createRequest model.ProductCreate, echoContext echo.Context) (model.Product, error) {
	product := createRequest.ToProduct()

	store := model.Store{
		OwnerEmail: helper.ExtractJwtEmail(echoContext),
	}
	if err := store.GetByOwnerEmail(s.database.Conn); err != nil {
		if err.Error() == "sql: no rows in result set" {
			return product, ErrDontHaveStore
		}
		return product, err
	}

	product.StoreID = store.ID

	if err := product.Create(s.database.Conn); err != nil {
		return product, err
	}

	return product, nil
}

func (s *ProductService) Update(updateRequest model.ProductUpdate, echoContext echo.Context) (model.Product, error) {
	product := updateRequest.ToProduct()
	if err := product.GetByID(s.database.Conn); err != nil {
		return product, ErrProductNotFound
	}

	store := model.Store{
		OwnerEmail: helper.ExtractJwtEmail(echoContext),
	}
	if err := store.GetByOwnerEmail(s.database.Conn); err != nil {
		if err.Error() == "sql: no rows in result set" {
			return product, ErrDontOwnProduct
		}
		return product, err
	}

	if product.StoreID != store.ID {
		return product, ErrDontOwnProduct
	}

	if err := product.UpdateByID(s.database.Conn); err != nil {
		return product, err
	}

	return product, nil
}
