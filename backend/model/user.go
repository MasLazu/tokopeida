package model

import (
	"time"
)

type User struct {
	Email     string     `json:"email,omitempty"`
	FirstName string     `json:"first_name,omitempty"`
	LastName  string     `json:"last_name,omitempty"`
	Password  string     `json:"-"`
	Balance   int64      `json:"balance"`
	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

type UserLogin struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

func (u *UserLogin) ToUser() User {
	return User{
		Email:    u.Email,
		Password: u.Password,
	}
}

type UserRegister struct {
	Email     string `json:"email" validate:"required,email"`
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Password  string `json:"password" validate:"required"`
}

func (u *UserRegister) ToUser() User {
	return User{
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Password:  u.Password,
	}
}

type UserUpdate struct {
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
}

func (u *UserUpdate) ToUser() User {
	return User{
		FirstName: u.FirstName,
		LastName:  u.LastName,
	}
}

type UserTopUp struct {
	Amount int64 `json:"amount" validate:"required,number"`
}
