package handler

import (
	"net/http"
	"tokopeida-backend/database"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"
	"tokopeida-backend/service"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type UserHandler struct {
	database    *database.Database
	validator   *validator.Validate
	authService *service.AuthService
	userService *service.UserService
}

func NewUserHandler(
	database *database.Database,
	validator *validator.Validate,
	authService *service.AuthService,
	userService *service.UserService,
) *UserHandler {
	return &UserHandler{
		database:    database,
		validator:   validator,
		authService: authService,
		userService: userService,
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
	user := model.User{
		Email: c.Param("email"),
	}

	if err := user.GetByEmail(h.database.Conn); err != nil {
		return echo.NewHTTPError(http.StatusNotFound, "User not found")
	}

	return c.JSON(http.StatusOK, user)
}

func (h *UserHandler) GetAll(c echo.Context) error {
	users, err := model.GetAllUsers(h.database.Conn)
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
	user.Update(h.database.Conn)

	return c.JSON(http.StatusOK, user)
}
