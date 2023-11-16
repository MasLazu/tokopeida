package handler

import (
	"net/http"
	"strconv"
	"tokopeida-backend/database"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

type CartHandler struct {
	database  *database.Database
	validator *validator.Validate
}

func NewCartHandler(
	database *database.Database,
	validator *validator.Validate,
) *CartHandler {
	return &CartHandler{
		database:  database,
		validator: validator,
	}
}

func (h *CartHandler) Create(c echo.Context) error {
	quantity, err := strconv.ParseInt(c.FormValue("quantity"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid quantity")
	}

	createRequest := model.CartCreate{
		ProductID: c.FormValue("product_id"),
		Quantity:  int(quantity),
	}

	if err := h.validator.Struct(createRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	cart := createRequest.ToCart()
	cart.UserEmail = helper.ExtractJwtEmail(c)

	if err := cart.Create(h.database.Conn); err != nil {
		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			return echo.NewHTTPError(http.StatusBadRequest, "Product already in cart")
		}
		return echo.ErrInternalServerError
	}

	product := model.Product{
		ID: cart.ProductID,
	}
	if err := product.GetByID(h.database.Conn); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusCreated, model.CartResponse{
		Product:  product,
		Quantity: cart.Quantity,
	})
}

func (h *CartHandler) Update(c echo.Context) error {
	quantity, err := strconv.ParseInt(c.FormValue("quantity"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid quantity")
	}

	updateRequest := model.CartCreate{
		ProductID: c.Param("product_id"),
		Quantity:  int(quantity),
	}

	if err := h.validator.Struct(updateRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if updateRequest.Quantity < 0 {
		return echo.NewHTTPError(http.StatusBadRequest, "Quantity must be greater than 0")
	}

	cart := updateRequest.ToCart()
	cart.UserEmail = helper.ExtractJwtEmail(c)

	if err := cart.Update(h.database.Conn); err != nil {
		return echo.ErrInternalServerError
	}

	product := model.Product{
		ID: cart.ProductID,
	}
	if err := product.GetByID(h.database.Conn); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusOK, model.CartResponse{
		Product:  product,
		Quantity: cart.Quantity,
	})
}

func (h *CartHandler) Delete(c echo.Context) error {
	cart := model.Cart{
		UserEmail: helper.ExtractJwtEmail(c),
		ProductID: c.Param("product_id"),
	}

	if err := cart.Delete(h.database.Conn); err != nil {
		return echo.ErrInternalServerError
	}

	product := model.Product{
		ID: cart.ProductID,
	}
	if err := product.GetByID(h.database.Conn); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusOK, product)
}

func (h *CartHandler) GetAllCurrentUser(c echo.Context) error {
	cartResponses, err := model.GetAllCartByEmail(
		h.database.Conn,
		helper.ExtractJwtEmail(c),
	)

	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, cartResponses)
}
