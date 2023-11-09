package middleware

import (
	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware"
)

type CorsMiddleware struct {
	Domain string
}

func NewCorsMiddleware(Domain string) *CorsMiddleware {
	return &CorsMiddleware{
		Domain: Domain,
	}
}

func (m *CorsMiddleware) Cors(e *echo.Echo) {
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{m.Domain},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	}))
}
