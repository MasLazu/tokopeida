package service

import (
	"errors"
	"tokopeida-backend/database"
	"tokopeida-backend/model"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var ErrEmailAlreadyTaken = errors.New("Email already taken")

type UserService struct {
	database *database.Database
}

func NewUserService(database *database.Database) *UserService {
	return &UserService{
		database: database,
	}
}

func (s *UserService) Register(registerRequest model.UserRegister) (model.User, error) {
	user := registerRequest.ToUser()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return user, err
	}

	user.Password = string(hashedPassword)

	if err := user.Create(s.database.Conn); err != nil {
		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			return user, ErrEmailAlreadyTaken
		}
		return user, err
	}

	return user, nil
}
