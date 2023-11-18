package service

import (
	"errors"
	"tokopeida-backend/model"
	"tokopeida-backend/repository"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var ErrEmailAlreadyTaken = errors.New("Email already taken")

type UserService struct {
	userRepository *repository.UserRepository
}

func NewUserService(userRepository *repository.UserRepository) *UserService {
	return &UserService{
		userRepository: userRepository,
	}
}

func (s *UserService) Register(registerRequest model.UserRegister) (model.User, error) {
	user := registerRequest.ToUser()

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return user, err
	}

	user.Password = string(hashedPassword)

	user, err = s.userRepository.Create(user)
	if err != nil {
		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			return user, ErrEmailAlreadyTaken
		}
		return user, err
	}

	return user, nil
}
