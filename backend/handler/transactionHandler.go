package handler

import (
	"log"
	"net/http"
	"tokopeida-backend/helper"
	"tokopeida-backend/repository"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type TransactionHandler struct {
	validator             *validator.Validate
	transactionRepository *repository.TransactionRepository
}

func NewTransactionHandler(
	validator *validator.Validate,
	transactionRepository *repository.TransactionRepository,
) *TransactionHandler {
	return &TransactionHandler{
		validator:             validator,
		transactionRepository: transactionRepository,
	}
}

func (h *TransactionHandler) GetAll(c echo.Context) error {
	transacrtions, err := h.transactionRepository.GetAll()
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, transacrtions)
}

func (h *TransactionHandler) GetAllCurrentUserTransaction(c echo.Context) error {
	transactions, err := h.transactionRepository.GetAllByUserEmailJoinProduct(helper.ExtractJwtEmail(c))
	if err != nil {
		log.Println(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, transactions)
}

func (h *TransactionHandler) GetAllStoreTransaction(c echo.Context) error {
	transaction, err := h.transactionRepository.GetAllByStoreIDJoinProduct(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Transaction not found")
	}

	return c.JSON(http.StatusOK, transaction)
}

func (h *TransactionHandler) GetByID(c echo.Context) error {
	transaction, err := h.transactionRepository.GetByID(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Transaction not found")
	}

	return c.JSON(http.StatusOK, transaction)
}
