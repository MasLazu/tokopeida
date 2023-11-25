package service

import (
	"errors"
	"io"
	"os"
	"tokopeida-backend/database"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"

	"github.com/google/uuid"
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
	database               *database.Database
	productRepository      *repository.ProductRepository
	storeRepository        *repository.StoreRepository
	transactionRepository  *repository.TransactionRepository
	productImageRepository *repository.ProductImageRepository
	userRepository         *repository.UserRepository
	authService            *AuthService
}

func NewProductService(
	database *database.Database,
	productRepository *repository.ProductRepository,
	storeRepository *repository.StoreRepository,
	transactionRepository *repository.TransactionRepository,
	userRepository *repository.UserRepository,
	productImageRepository *repository.ProductImageRepository,
	auAuthService *AuthService,
) *ProductService {
	return &ProductService{
		database:               database,
		productRepository:      productRepository,
		storeRepository:        storeRepository,
		transactionRepository:  transactionRepository,
		userRepository:         userRepository,
		productImageRepository: productImageRepository,
		authService:            auAuthService,
	}
}

func (s *ProductService) Buy(transactionRequest model.TransactionCreate, echoContext echo.Context) (model.Transaction, error) {
	var transaction model.Transaction

	user, err := s.authService.CurrentUser(echoContext)
	if err != nil {
		return transaction, err
	}

	product, err := s.productRepository.GetByID(transactionRequest.ProductID)
	if err != nil {
		return transaction, ErrProductNotFound
	}

	store, err := s.storeRepository.GetByID(product.StoreID)
	if err != nil {
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

	tx, err := s.database.BeginTransaction()
	if err != nil {
		return transaction, err
	}

	storeOwner, err := s.userRepository.GetByEmail(store.OwnerEmail)
	if err != nil {
		tx.Rollback()
		return transaction, err
	}

	storeOwner.Balance += valueTransaction
	if _, err := s.userRepository.UpdateBalanceWithTransaction(storeOwner, tx); err != nil {
		tx.Rollback()
		return transaction, err
	}

	user.Balance -= valueTransaction
	user, err = s.userRepository.UpdateBalanceWithTransaction(user, tx)
	if err != nil {
		tx.Rollback()
		return transaction, err
	}

	transaction = transactionRequest.ToTransaction()
	transaction.UserEmail = user.Email

	transaction, err = s.transactionRepository.CreateWithTransaction(transaction, tx)
	if err != nil {
		tx.Rollback()
		return transaction, err
	}

	product.Stock -= transaction.Quantity
	product.Sold += transaction.Quantity
	product, err = s.productRepository.UpdateWithTransaction(product, tx)
	if err != nil {
		tx.Rollback()
		return transaction, err
	}

	if err := tx.Commit(); err != nil {
		return transaction, err
	}
	transaction.Product = product
	transaction.ProductID = ""

	return transaction, nil
}

func (s *ProductService) BuyMultiple(transactionRequest model.MultipleTransactionCreate, echoContext echo.Context) ([]model.Transaction, error) {
	var transaction []model.Transaction

	user, err := s.authService.CurrentUser(echoContext)
	if err != nil {
		return transaction, err
	}

	tx, err := s.database.BeginTransaction()
	if err != nil {
		return transaction, err
	}

	for i, transactionRequest := range transactionRequest.Transactions {
		transaction = append(transaction, model.Transaction{})

		product, err := s.productRepository.GetByID(transactionRequest.ProductID)
		if err != nil {
			tx.Rollback()
			return transaction, ErrProductNotFound
		}

		store, err := s.storeRepository.GetByID(product.StoreID)
		if err != nil {
			tx.Rollback()
			return transaction, err
		}

		if store.OwnerEmail == user.Email {
			tx.Rollback()
			return transaction, ErrBuyYourOwnProduct
		}

		if product.Stock < transactionRequest.Quantity {
			tx.Rollback()
			return transaction, ErrInsufficientStock
		}

		valueTransaction := product.Price * int64(transactionRequest.Quantity)

		if valueTransaction > user.Balance {
			tx.Rollback()
			return transaction, ErrInsufficientBalance
		}

		storeOwner, err := s.userRepository.GetByEmail(store.OwnerEmail)
		if err != nil {
			tx.Rollback()
			return transaction, err
		}

		storeOwner.Balance += valueTransaction
		if _, err := s.userRepository.UpdateBalanceWithTransaction(storeOwner, tx); err != nil {
			tx.Rollback()
			return transaction, err
		}

		user.Balance -= valueTransaction
		user, err = s.userRepository.UpdateBalanceWithTransaction(user, tx)
		if err != nil {
			tx.Rollback()
			return transaction, err
		}

		transaction[i] = transactionRequest.ToTransaction()
		transaction[i].UserEmail = user.Email

		transaction[i], err = s.transactionRepository.CreateWithTransaction(transaction[i], tx)
		if err != nil {
			tx.Rollback()
			return transaction, err
		}

		product.Stock -= transaction[i].Quantity
		product.Sold += transaction[i].Quantity
		product, err = s.productRepository.UpdateWithTransaction(product, tx)
		if err != nil {
			tx.Rollback()
			return transaction, err
		}

		transaction[i].Product = product
		transaction[i].ProductID = ""
	}

	if user.Balance < 0 {
		tx.Rollback()
		return transaction, ErrInsufficientBalance
	}

	if err := tx.Commit(); err != nil {
		return transaction, err
	}

	return transaction, nil
}

func (s *ProductService) Create(createRequest model.ProductCreate, echoContext echo.Context) (model.Product, error) {
	product := createRequest.ToProduct()

	store, err := s.storeRepository.GetByOwnerEmail(helper.ExtractJwtEmail(echoContext))
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return product, ErrDontHaveStore
		}
		return product, err
	}

	product.StoreID = store.ID

	product, err = s.productRepository.Create(product)
	if err != nil {
		return product, err
	}

	for _, image := range createRequest.Images {
		fileName := uuid.New().String() + ".jpg"

		src, err := image.Open()
		if err != nil {
			return product, err
		}
		defer src.Close()

		dst, err := os.Create("./static/product_images/" + fileName)
		if err != nil {
			return product, err
		}
		defer dst.Close()

		if _, err = io.Copy(dst, src); err != nil {
			return product, err
		}

		productImage := model.ProductImage{
			FileName:  fileName,
			ProductID: product.ID,
		}

		productImage, err = s.productImageRepository.Create(productImage)
		if err != nil {
			return product, err
		}

		product.Images = append(product.Images, fileName)
	}

	return product, nil
}

func (s *ProductService) Update(updateRequest model.ProductUpdate, echoContext echo.Context) (model.Product, error) {
	product := updateRequest.ToProduct()
	if _, err := s.productRepository.GetByID(product.ID); err != nil {
		return product, ErrProductNotFound
	}

	store := model.Store{
		OwnerEmail: helper.ExtractJwtEmail(echoContext),
	}
	store, err := s.storeRepository.GetByOwnerEmail(helper.ExtractJwtEmail(echoContext))
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return product, ErrDontOwnProduct
		}
		return product, err
	}

	if product.StoreID != store.ID {
		return product, ErrDontOwnProduct
	}

	product, err = s.productRepository.Update(product)
	if err != nil {
		return product, err
	}

	return product, nil
}
