package handler

import (
	"net/http"
	"strconv"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"
	"tokopeida-backend/service"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type UserHandler struct {
	validator      *validator.Validate
	userRepository *repository.UserRepository
	authService    *service.AuthService
	userService    *service.UserService
}

func NewUserHandler(
	validator *validator.Validate,
	userRepository *repository.UserRepository,
	authService *service.AuthService,
	userService *service.UserService,
) *UserHandler {
	return &UserHandler{
		validator:      validator,
		userRepository: userRepository,
		authService:    authService,
		userService:    userService,
	}
}

func (h *UserHandler) Register(c echo.Context) error {
	registerRequest := model.UserRegister{
		Email:     c.FormValue("email"),
		FirstName: c.FormValue("first_name"),
		LastName:  c.FormValue("last_name"),
		Password:  c.FormValue("password"),
	}

	if err := h.validator.Struct(registerRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	user, err := h.userService.Register(registerRequest)
	switch err {
	case service.ErrEmailAlreadyTaken:
		return echo.NewHTTPError(http.StatusBadRequest, "Email already taken")
	case nil:
		return c.JSON(http.StatusOK, user)
	default:
		return echo.ErrInternalServerError
	}
}

func (h *UserHandler) GetByEmail(c echo.Context) error {
	user, err := h.userRepository.GetByEmail(c.Param("email"))
	if err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "User not found")
	}

	return c.JSON(http.StatusOK, user)
}

func (h *UserHandler) GetAll(c echo.Context) error {
	users, err := h.userRepository.GetAll()
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, users)
}

func (h *UserHandler) GetCurrent(c echo.Context) error {
	user, err := h.authService.CurrentUser(c)
	if err != nil {
		return echo.ErrUnauthorized
	}

	return c.JSON(http.StatusOK, user)
}

func (h *UserHandler) UpdateCurrent(c echo.Context) error {
	updateRequest := model.UserUpdate{
		FirstName: c.FormValue("first_name"),
		LastName:  c.FormValue("last_name"),
	}

	if err := h.validator.Struct(updateRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	user := updateRequest.ToUser()
	user.Email = helper.ExtractJwtEmail(c)
	user, err := h.userRepository.Update(user)
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, user)
}

func (h *UserHandler) TopUp(c echo.Context) error {
	price, err := strconv.ParseInt(c.FormValue("amount"), 10, 64)

	if err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid amount")
	}

	topUpRequest := model.UserTopUp{
		Amount: price,
	}

	if err := h.validator.Struct(topUpRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	user, err := h.authService.CurrentUser(c)
	if err != nil {
		return echo.ErrUnauthorized
	}

	user.Balance += topUpRequest.Amount
	user, err = h.userRepository.UpdateBalance(user)
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, user)
}
