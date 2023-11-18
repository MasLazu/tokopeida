package handler

import (
	"net/http"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"
	"tokopeida-backend/service"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	jwtKey                 []byte
	validator              *validator.Validate
	refreshTokenRepository *repository.RefreshTokenRepository
	authService            *service.AuthService
}

func NewAuthHandler(
	jwtKey []byte,
	validator *validator.Validate,
	refreshTokenRepository *repository.RefreshTokenRepository,
	authService *service.AuthService,
) *AuthHandler {
	return &AuthHandler{
		validator:              validator,
		refreshTokenRepository: refreshTokenRepository,
		authService:            authService,
		jwtKey:                 jwtKey,
	}
}

func (h *AuthHandler) Login(c echo.Context) error {
	loginRequest := model.UserLogin{
		Email:    c.FormValue("email"),
		Password: c.FormValue("password"),
	}

	if err := h.validator.Struct(loginRequest); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	accessToken, err := h.authService.Login(loginRequest, c)

	switch err {
	case service.ErrInvalidEmailOrPassword:
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid email or password")
	case nil:
		return c.JSON(http.StatusOK, echo.Map{
			"access_token": accessToken,
		})
	default:
		return echo.ErrInternalServerError
	}
}

func (h *AuthHandler) Refresh(c echo.Context) error {
	cookie, err := c.Cookie("refresh_token")
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid refresh token")
	}

	refreshToken, err := h.refreshTokenRepository.GetByToken(cookie.Value)
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid refresh token")
	}

	signedToken, err := helper.GenerateJwtToken(refreshToken.UserEmail, h.jwtKey)
	if err != nil {
		return echo.ErrInternalServerError
	}

	return c.JSON(http.StatusOK, echo.Map{
		"access_token": signedToken,
	})
}

func (h *AuthHandler) Logout(c echo.Context) error {
	cookie, err := c.Cookie("refresh_token")
	if err != nil {
		return echo.NewHTTPError(http.StatusUnauthorized, "Invalid refresh token")
	}

	refreshToken := model.RefreshToken{Token: cookie.Value}
	if err := h.refreshTokenRepository.Delete(refreshToken); err != nil {
		return echo.ErrInternalServerError
	}

	helper.ClearRefreshTokenCookies(c)

	return c.NoContent(http.StatusOK)
}
