package handler

import (
	"tokopeida-backend/database"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type WishlistHandler struct {
	database  *database.Database
	validator *validator.Validate
}

func NewWishlistHandler(
	database *database.Database,
	validator *validator.Validate,
) *WishlistHandler {
	return &WishlistHandler{
		database:  database,
		validator: validator,
	}
}

func (h *WishlistHandler) Create(c echo.Context) error {
	product := model.Product{
		ID: c.Param("product_id"),
	}

	if err := product.GetByID(h.database.Conn); err != nil {
		return echo.NewHTTPError(404, "Product not found")
	}

	wishlist := model.Wishlist{
		UserEmail: helper.ExtractJwtEmail(c),
		ProductID: product.ID,
	}

	if err := wishlist.Create(h.database.Conn); err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(201, wishlist)
}

func (h *WishlistHandler) Delete(c echo.Context) error {
	wishlist := model.Wishlist{
		UserEmail: helper.ExtractJwtEmail(c),
		ProductID: c.Param("product_id"),
	}

	if err := wishlist.Delete(h.database.Conn); err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(200, wishlist)
}

func (h *WishlistHandler) GetAllCurrentUser(c echo.Context) error {
	wishlists, err := model.GetAllByUserEmail(
		h.database.Conn,
		helper.ExtractJwtEmail(c),
	)

	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(200, wishlists)
}
