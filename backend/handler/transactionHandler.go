package handler

import (
	"net/http"
	"tokopeida-backend/database"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type TransactionHandler struct {
	database  *database.Database
	validator *validator.Validate
}

func NewTransactionHandler(
	database *database.Database,
	validator *validator.Validate,
) *TransactionHandler {
	return &TransactionHandler{
		database:  database,
		validator: validator,
	}
}

func (h *TransactionHandler) GetAll(c echo.Context) error {
	stores, err := model.GetAllTransaction(h.database.Conn)
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, stores)
}

func (h *TransactionHandler) GetAllCurrentUserTransaction(c echo.Context) error {
	transactions, err := model.GetAllTransactionByUserEmail(h.database.Conn, helper.ExtractJwtEmail(c))
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, transactions)
}

func (h *TransactionHandler) GetByID(c echo.Context) error {
	transaction := model.Transaction{
		ID: c.Param("id"),
	}

	if err := transaction.GetByID(h.database.Conn); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Transaction not found")
	}

	return c.JSON(http.StatusOK, transaction)
}
