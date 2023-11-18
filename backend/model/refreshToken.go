package model

import (
	"time"
)

type RefreshToken struct {
	Token     string
	UserEmail string
	ExpiresAt *time.Time
}
