package model

type ProductImage struct {
	FileName  string `json:"file_name,omitempty"`
	ProductID string `json:"product_id,omitempty"`
}
