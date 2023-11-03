package service

import (
	"errors"
	"tokopeida-backend/database"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidEmailOrPassword = errors.New("Invalid email or password")

type AuthService struct {
	database *database.Database
	jwtKey   []byte
}

func NewAuthService(database *database.Database, jwtKey []byte) *AuthService {
	return &AuthService{
		database: database,
		jwtKey:   jwtKey,
	}
}

func (s *AuthService) CurrentUser(c echo.Context) (model.User, error) {
	user := model.User{
		Email: helper.ExtractJwtEmail(c),
	}

	if err := user.GetByEmail(s.database.Conn); err != nil {
		return user, err
	}

	return user, nil
}

func (s *AuthService) Login(loginRequest model.UserLogin, c echo.Context) (string, error) {
	var accessToken string

	password := loginRequest.Password
	user := loginRequest.ToUser()
	if err := user.GetByEmail(s.database.Conn); err != nil {
		if err.Error() == "sql: no rows in result set" {
			return accessToken, ErrInvalidEmailOrPassword
		}
		return accessToken, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return accessToken, ErrInvalidEmailOrPassword
	}

	refreshToken := model.RefreshToken{
		UserEmail: user.Email,
	}
	if err := refreshToken.Create(s.database.Conn); err != nil {
		return accessToken, err
	}

	helper.AssignRefreshTokenCookes(refreshToken.Token, c)

	accessToken, err := helper.GenerateJwtToken(user.Email, s.jwtKey)
	if err != nil {
		return accessToken, err
	}

	return accessToken, nil
}
