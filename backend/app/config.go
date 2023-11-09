package app

import (
	"os"
	"tokopeida-backend/helper"

	"github.com/golang-jwt/jwt/v5"
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
)

type Config struct {
	Domain      string
	DatabaseUrl string
	Port        string
	Jwt         echojwt.Config
}

func NewConfig() *Config {
	return &Config{
		DatabaseUrl: os.Getenv("DATABASE_URL"),
		Port:        os.Getenv("PORT"),
		Domain:      os.Getenv("DOMAIN"),
		Jwt: echojwt.Config{
			NewClaimsFunc: func(c echo.Context) jwt.Claims {
				return new(helper.JwtCustomClaims)
			},
			SigningKey: []byte(os.Getenv("JWT_KEY")),
		},
	}
}
