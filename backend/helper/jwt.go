package helper

import (
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

type JwtData struct {
	Email string
}

type JwtCustomClaims struct {
	Email string `json:"email,omitempty"`
	jwt.RegisteredClaims
}

func getJwtValue(c echo.Context, key string) (string, bool) {
	jwtToken := c.Get("user").(*jwt.Token)
	claims := jwtToken.Claims.(jwt.MapClaims)

	if claims[key] != nil {
		return claims[key].(string), true
	}

	return "", false
}

func ExtractJwtEmail(c echo.Context) string {
	if value, ok := getJwtValue(c, "email"); ok {
		return value
	}
	return ""
}

func GenerateJwtToken(email string, jwtKey []byte) (string, error) {
	claims := JwtCustomClaims{
		Email: email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Hour * 3)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}

func AssignRefreshTokenCookes(token string, c echo.Context) {
	cookie := &http.Cookie{
		Name:     "refresh_token",
		Value:    token,
		Expires:  time.Now().Add(time.Hour * 24 * 30),
		HttpOnly: true,
		Path:     "/",
		SameSite: http.SameSiteStrictMode,
	}
	c.SetCookie(cookie)
}

func ClearRefreshTokenCookies(c echo.Context) {
	cookie := new(http.Cookie)
	cookie.Name = "refresh_token"
	cookie.Value = ""
	cookie.Expires = time.Now().Add(-time.Hour)
	cookie.HttpOnly = true
	c.SetCookie(cookie)
}
