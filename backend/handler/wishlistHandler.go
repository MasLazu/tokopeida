package handler

import (
	"log"
	"net/http"
	"tokopeida-backend/database"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"

	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

type WishlistHandler struct {
	database *database.Database
}

func NewWishlistHandler(
	database *database.Database,
) *WishlistHandler {
	return &WishlistHandler{
		database: database,
	}
}

func (h *WishlistHandler) Create(c echo.Context) error {
	product := model.Product{
		ID: c.Param("product_id"),
	}

	if err := product.GetByID(h.database.Conn); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	wishlist := model.Wishlist{
		UserEmail: helper.ExtractJwtEmail(c),
		ProductID: product.ID,
	}

	if err := wishlist.Create(h.database.Conn); err != nil {
		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			return echo.NewHTTPError(http.StatusBadRequest, "Product already in wishlist")
		}
		return echo.ErrInternalServerError
	}

	product = model.Product{
		ID: wishlist.ProductID,
	}
	if err := product.GetByID(h.database.Conn); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusCreated, product)
}

func (h *WishlistHandler) Delete(c echo.Context) error {
	wishlist := model.Wishlist{
		UserEmail: helper.ExtractJwtEmail(c),
		ProductID: c.Param("product_id"),
	}

	if err := wishlist.Delete(h.database.Conn); err != nil {
		return echo.ErrInternalServerError
	}

	product := model.Product{
		ID: wishlist.ProductID,
	}
	if err := product.GetByID(h.database.Conn); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusOK, product)
}

func (h *WishlistHandler) GetAllCurrentUser(c echo.Context) error {
	wishlists, err := model.GetAllWishlistProductByUserEmail(
		h.database.Conn,
		helper.ExtractJwtEmail(c),
	)

	if err != nil {
		log.Println(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, wishlists)
}
