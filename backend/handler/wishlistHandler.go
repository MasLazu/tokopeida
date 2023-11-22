package handler

import (
	"net/http"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"

	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

type WishlistHandler struct {
	productRepository  *repository.ProductRepository
	wishlistRepository *repository.WishlistRepository
}

func NewWishlistHandler(
	productRepository *repository.ProductRepository,
	wishlistRepository *repository.WishlistRepository,
) *WishlistHandler {
	return &WishlistHandler{
		productRepository:  productRepository,
		wishlistRepository: wishlistRepository,
	}
}

func (h *WishlistHandler) Create(c echo.Context) error {
	product, err := h.productRepository.GetByID(c.Param("product_id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	wishlist := model.Wishlist{
		UserEmail: helper.ExtractJwtEmail(c),
		ProductID: product.ID,
	}

	wishlist, err = h.wishlistRepository.Create(wishlist)
	if err != nil {
		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			return echo.NewHTTPError(http.StatusBadRequest, "Product already in wishlist")
		}
		return echo.ErrInternalServerError
	}

	product, err = h.productRepository.GetByIDJoinProductImage(wishlist.ProductID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusCreated, product)
}

func (h *WishlistHandler) Delete(c echo.Context) error {
	wishlist := model.Wishlist{
		UserEmail: helper.ExtractJwtEmail(c),
		ProductID: c.Param("product_id"),
	}

	if err := h.wishlistRepository.Delete(wishlist); err != nil {
		return echo.ErrInternalServerError
	}

	product, err := h.productRepository.GetByIDJoinProductImage(wishlist.ProductID)
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusOK, product)
}

func (h *WishlistHandler) GetAllCurrentUser(c echo.Context) error {
	products, err := h.productRepository.GetAllWishlisProductByUserEmail(helper.ExtractJwtEmail(c))
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, products)
}
