package handler

import (
	"log"
	"net/http"
	"net/url"
	"strconv"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"
	"tokopeida-backend/service"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type ProductHandler struct {
	validator         *validator.Validate
	productRepository *repository.ProductRepository
	productService    *service.ProductService
}

func NewProductHandler(
	validator *validator.Validate,
	productRepository *repository.ProductRepository,
	productService *service.ProductService,
) *ProductHandler {
	return &ProductHandler{
		validator:         validator,
		productRepository: productRepository,
		productService:    productService,
	}
}

func (h *ProductHandler) GetAll(c echo.Context) error {
	products, err := h.productRepository.GetAllJoinProductImage()
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) GetByID(c echo.Context) error {
	product, err := h.productRepository.GetByIDJoinProductImage(c.Param("id"))
	if err != nil {
		log.Println(err)
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	}

	return c.JSON(http.StatusOK, product)
}

func (h *ProductHandler) CreateCurrentStoreProduct(c echo.Context) error {
	price, err := strconv.ParseInt(c.FormValue("price"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid price")
	}

	stock, err := strconv.ParseInt(c.FormValue("stock"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid stock")
	}

	form, err := c.MultipartForm()
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid image")
	}

	createRequest := model.ProductCreate{
		Name:        c.FormValue("name"),
		Description: c.FormValue("description"),
		Price:       price,
		Stock:       int(stock),
		Images:      form.File["images"],
	}

	if err := h.validator.Struct(createRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	product, err := h.productService.Create(createRequest, c)
	switch err {
	case service.ErrDontHaveStore:
		return echo.NewHTTPError(http.StatusBadRequest, "You don't have a store yet")
	case nil:
		return c.JSON(http.StatusCreated, product)
	default:
		log.Println(err)
		return echo.ErrInternalServerError
	}
}

func (h *ProductHandler) UpdateCurrentStoreProduct(c echo.Context) error {
	price, err := strconv.ParseInt(c.FormValue("price"), 10, 64)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid price")
	}

	stock, err := strconv.ParseInt(c.FormValue("stock"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid stock")
	}

	updateRequest := model.ProductUpdate{
		ID:          c.Param("id"),
		Name:        c.FormValue("name"),
		Description: c.FormValue("description"),
		Price:       price,
		Stock:       int(stock),
	}

	if err := h.validator.Struct(updateRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	product, err := h.productService.Update(updateRequest, c)
	switch err {
	case service.ErrProductNotFound:
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	case service.ErrDontOwnProduct:
		return echo.NewHTTPError(http.StatusBadRequest, "You don't own this product")
	case nil:
		return c.JSON(http.StatusOK, product)
	default:
		return echo.ErrInternalServerError
	}
}

func (h *ProductHandler) GetAllStoreProduct(c echo.Context) error {
	products, err := h.productRepository.GetAllByStoreIDJoinImage(c.Param("id"))
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) GetExploreProduct(c echo.Context) error {
	amount, err := strconv.ParseInt(c.Param("amount"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid amount")
	}

	products, err := h.productRepository.GetRandomJoinImage(int(amount))
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) Buy(c echo.Context) error {
	quantity, err := strconv.ParseInt(c.FormValue("quantity"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid quantity")
	}

	transactionRequest := model.TransactionCreate{
		ProductID: c.Param("id"),
		Quantity:  int(quantity),
	}

	if err := h.validator.Struct(transactionRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	transaction, err := h.productService.Buy(transactionRequest, c)
	switch err {
	case service.ErrProductNotFound:
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	case service.ErrInsufficientStock:
		return echo.NewHTTPError(http.StatusBadRequest, "You buy more than the available stock")
	case service.ErrInsufficientBalance:
		return echo.NewHTTPError(http.StatusBadRequest, "You don't have enough balance to buy this product")
	case service.ErrBuyYourOwnProduct:
		return echo.NewHTTPError(http.StatusBadRequest, "You can't buy your own product")
	case nil:
		return c.JSON(http.StatusCreated, transaction)
	default:
		log.Println(err)
		return echo.ErrInternalServerError
	}
}

func (h *ProductHandler) BuyMultiple(c echo.Context) error {
	var transactionRequest model.MultipleTransactionCreate
	if err := c.Bind(&transactionRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	if err := h.validator.Struct(transactionRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	transactions, err := h.productService.BuyMultiple(transactionRequest, c)
	switch err {
	case service.ErrProductNotFound:
		return echo.NewHTTPError(http.StatusNotFound, "Product not found")
	case service.ErrInsufficientStock:
		return echo.NewHTTPError(http.StatusBadRequest, "You buy more than the available stock")
	case service.ErrInsufficientBalance:
		return echo.NewHTTPError(http.StatusBadRequest, "You don't have enough balance to buy this product")
	case service.ErrBuyYourOwnProduct:
		return echo.NewHTTPError(http.StatusBadRequest, "You can't buy your own product")
	case nil:
		return c.JSON(http.StatusCreated, transactions)
	default:
		log.Println(err)
		return echo.ErrInternalServerError
	}
}

func (h *ProductHandler) Search(c echo.Context) error {
	limit, err := strconv.ParseInt(c.FormValue("limit"), 10, 32)
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid limit")
	}

	keyword, err := url.QueryUnescape(c.Param("keyword"))
	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid keyword")
	}

	products, err := h.productRepository.SearchJoinImage(keyword, int(limit))
	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			return echo.NewHTTPError(http.StatusNotFound, "Product not found")
		}
		log.Println(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, products)
}
