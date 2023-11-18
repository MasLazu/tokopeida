package model

type Cart struct {
	UserEmail string  `json:"user_email,omitempty"`
	ProductID string  `json:"product_id,omitempty"`
	Product   Product `json:"product,omitempty"`
	Quantity  int     `json:"quantity,omitempty"`
}

type CartCreate struct {
	ProductID string `json:"product_id" validate:"required"`
	Quantity  int    `json:"quantity" validate:"required,number"`
}

func (c *CartCreate) ToCart() Cart {
	return Cart{
		ProductID: c.ProductID,
		Quantity:  c.Quantity,
	}
}
