package middleware

import (
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

type AuthMiddleware struct {
	config    echojwt.Config
	LoginOnly echo.MiddlewareFunc
}

func NewAuthMiddleware(config echojwt.Config) *AuthMiddleware {
	return &AuthMiddleware{
		config:    config,
		LoginOnly: echojwt.JWT(config.SigningKey.([]byte)),
	}
}
