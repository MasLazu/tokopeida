package handler

import (
	"log"
	"net/http"
	"strconv"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

type CartHandler struct {
	validator         *validator.Validate
	cartRepository    *repository.CartRepository
	productRepository *repository.ProductRepository
}

func NewCartHandler(
	validator *validator.Validate,
	cartRepository *repository.CartRepository,
	productRepository *repository.ProductRepository,
) *CartHandler {
	return &CartHandler{
		validator:         validator,
		cartRepository:    cartRepository,
		productRepository: productRepository,
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

	cart, err = h.cartRepository.Create(cart)
	if err != nil {
		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			return echo.NewHTTPError(http.StatusBadRequest, "Product already in cart")
		}
		return echo.ErrInternalServerError
	}

	product, err := h.productRepository.GetByID(cart.ProductID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusCreated, model.Cart{
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

	cart, err = h.cartRepository.Update(cart)
	if err != nil {
		return echo.ErrInternalServerError
	}

	product, err := h.productRepository.GetByID(cart.ProductID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusOK, model.Cart{
		Product:  product,
		Quantity: cart.Quantity,
	})
}

func (h *CartHandler) Delete(c echo.Context) error {
	cart := model.Cart{
		UserEmail: helper.ExtractJwtEmail(c),
		ProductID: c.Param("product_id"),
	}

	if err := h.cartRepository.Delete(cart); err != nil {
		return echo.ErrInternalServerError
	}

	product, err := h.productRepository.GetByID(cart.ProductID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusOK, product)
}

func (h *CartHandler) GetAllCurrentUser(c echo.Context) error {
	carts, err := h.cartRepository.GetAllByUserEmailJoinProductJoinProductImages(helper.ExtractJwtEmail(c))
	if err != nil {
		log.Println(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, carts)
}
