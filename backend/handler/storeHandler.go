package handler

import (
	"log"
	"net/http"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/lib/pq"
)

type StoreHandler struct {
	validator       *validator.Validate
	storeRepository *repository.StoreRepository
}

func NewStoreHandler(
	validator *validator.Validate,
	storeRepository *repository.StoreRepository,
) *StoreHandler {
	return &StoreHandler{
		validator:       validator,
		storeRepository: storeRepository,
	}
}

func (h *StoreHandler) GetAll(c echo.Context) error {
	stores, err := h.storeRepository.GetAll()
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, stores)
}

func (h *StoreHandler) GetByID(c echo.Context) error {
	store, err := h.storeRepository.GetByID(c.Param("id"))
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Store not found")
	}

	return c.JSON(http.StatusOK, store)
}

func (h *StoreHandler) CreateCurrentUserStore(c echo.Context) error {
	registerRequest := model.StoreRegister{
		Name: c.FormValue("name"),
		City: c.FormValue("city"),
	}

	if err := h.validator.Struct(registerRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	store := registerRequest.ToStore()
	store.OwnerEmail = helper.ExtractJwtEmail(c)

	store, err := h.storeRepository.Create(store)
	if err != nil {
		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			return echo.NewHTTPError(http.StatusBadRequest, "This account already has a store")
		}
		log.Println(err)
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusCreated, store)
}

func (h *StoreHandler) GetCurrent(c echo.Context) error {
	store, err := h.storeRepository.GetByOwnerEmail(helper.ExtractJwtEmail(c))
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "Store not found")
	}

	return c.JSON(http.StatusOK, store)
}

func (h *StoreHandler) UpdateCurrent(c echo.Context) error {
	updateRequest := model.StoreRegister{
		Name: c.FormValue("name"),
	}

	if err := h.validator.Struct(updateRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	store := updateRequest.ToStore()
	store.OwnerEmail = helper.ExtractJwtEmail(c)

	store, err := h.storeRepository.UpdateByOwnerEmail(store)
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, store)
}
