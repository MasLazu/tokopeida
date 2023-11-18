package service

import (
	"errors"
	"tokopeida-backend/helper"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"

	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

var ErrInvalidEmailOrPassword = errors.New("Invalid email or password")

type AuthService struct {
	jwtKey                 []byte
	userRepository         *repository.UserRepository
	refreshTokenRepository *repository.RefreshTokenRepository
}

func NewAuthService(
	jwtKey []byte,
	userRepository *repository.UserRepository,
	refreshTokenRepository *repository.RefreshTokenRepository,
) *AuthService {
	return &AuthService{
		userRepository:         userRepository,
		refreshTokenRepository: refreshTokenRepository,
		jwtKey:                 jwtKey,
	}
}

func (s *AuthService) CurrentUser(c echo.Context) (model.User, error) {
	user := model.User{
		Email: helper.ExtractJwtEmail(c),
	}

	var err error
	user, err = s.userRepository.GetByEmail(helper.ExtractJwtEmail(c))
	if err != nil {
		return user, err
	}

	return user, nil
}

func (s *AuthService) Login(loginRequest model.UserLogin, c echo.Context) (string, error) {
	var err error
	var accessToken string

	password := loginRequest.Password
	user := loginRequest.ToUser()

	user, err = s.userRepository.GetByEmail(user.Email)
	if err != nil {
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

	refreshToken, err = s.refreshTokenRepository.Create(refreshToken)
	if err != nil {
		return accessToken, err
	}

	helper.AssignRefreshTokenCookes(refreshToken.Token, c)

	accessToken, err = helper.GenerateJwtToken(user.Email, s.jwtKey)
	if err != nil {
		return accessToken, err
	}

	return accessToken, nil
}
