package model

import (
	"mime/multipart"
	"time"
)

type Product struct {
	ID          string     `json:"id,omitempty"`
	Name        string     `json:"name,omitempty"`
	StoreID     string     `json:"store_id,omitempty"`
	Description string     `json:"description,omitempty"`
	Stock       int        `json:"stock"`
	Sold        int        `json:"sold"`
	Price       int64      `json:"price,omitempty"`
	Images      []string   `json:"images,omitempty"`
	CreatedAt   *time.Time `json:"created_at,omitempty"`
	UpdatedAt   *time.Time `json:"updated_at,omitempty"`
}

type ProductCreate struct {
	Name        string                  `json:"name" validate:"required"`
	Description string                  `json:"description" validate:"required"`
	Stock       int                     `json:"stock" validate:"required"`
	Price       int64                   `json:"price" validate:"required"`
	Images      []*multipart.FileHeader `json:"_"`
}

func (p *ProductCreate) ToProduct() Product {
	return Product{
		Name:        p.Name,
		Description: p.Description,
		Stock:       p.Stock,
		Price:       p.Price,
	}
}

type ProductUpdate struct {
	ID          string `json:"id" validate:"required"`
	Name        string `json:"name" validate:"required"`
	Description string `json:"description" validate:"required"`
	Stock       int    `json:"stock" validate:"required"`
	Price       int64  `json:"price" validate:"required"`
}

func (p *ProductUpdate) ToProduct() Product {
	return Product{
		ID:          p.ID,
		Name:        p.Name,
		Description: p.Description,
		Stock:       p.Stock,
		Price:       p.Price,
	}
}
