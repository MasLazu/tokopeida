package model

import (
	"time"
)

type Store struct {
	ID         string     `json:"id,omitempty"`
	OwnerEmail string     `json:"owner_email,omitempty"`
	Name       string     `json:"name,omitempty"`
	Products   []Product  `json:"products,omitempty"`
	City       string     `json:"city,omitempty"`
	CreatedAt  *time.Time `json:"created_at,omitempty"`
	UpdatedAt  *time.Time `json:"updated_at,omitempty"`
}

type StoreRegister struct {
	Name string `json:"name" validate:"required"`
	City string `json:"city" validate:"required"`
}

func (s *StoreRegister) ToStore() Store {
	return Store{Name: s.Name, City: s.City}
}
