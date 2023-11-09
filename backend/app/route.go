package app

import (
	"tokopeida-backend/handler"
	"tokopeida-backend/middleware"

	"github.com/labstack/echo/v4"
)

func SetupRoute(
	e *echo.Echo,
	authHandler *handler.AuthHandler,
	userHandler *handler.UserHandler,
	storeHandler *handler.StoreHandler,
	productHandler *handler.ProductHandler,
	transactionHandler *handler.TransactionHandler,
	authMiddleware *middleware.AuthMiddleware,
	corsMiddleware *middleware.CorsMiddleware,
) {
	corsMiddleware.Cors(e)

	auth := e.Group("/auth")
	auth.POST("/login", authHandler.Login)
	auth.POST("/logout", authHandler.Logout, authMiddleware.LoginOnly)
	auth.GET("/refresh", authHandler.Refresh)

	user := e.Group("/user")
	user.GET("", userHandler.GetAll)
	user.POST("", userHandler.Register)
	user.GET("/:email", userHandler.GetByEmail)
	user.GET("/current", userHandler.GetCurrent, authMiddleware.LoginOnly)
	user.PUT("/current", userHandler.UpdateCurrent, authMiddleware.LoginOnly)
	user.GET("/current/transaction", transactionHandler.GetAllCurrentUserTransaction, authMiddleware.LoginOnly)

	store := e.Group("/store")
	store.GET("", storeHandler.GetAll)
	store.GET("/:id", storeHandler.GetByID)
	store.GET("/current", storeHandler.GetCurrent, authMiddleware.LoginOnly)
	store.POST("/current", storeHandler.CreateCurrentUserStore, authMiddleware.LoginOnly)
	store.PUT("/current", storeHandler.UpdateCurrent, authMiddleware.LoginOnly)
	store.POST("/current/product", productHandler.CreateCurrentStoreProduct, authMiddleware.LoginOnly)
	store.PUT("/current/product/:id", productHandler.UpdateCurrentStoreProduct, authMiddleware.LoginOnly)

	product := e.Group("/product")
	product.GET("", productHandler.GetAll)
	product.GET("/:id", productHandler.GetByID)
	product.POST("/:id/buy", productHandler.Buy, authMiddleware.LoginOnly)

	transaction := e.Group("/transaction")
	transaction.GET("", transactionHandler.GetAll)
	transaction.GET("/:id", transactionHandler.GetByID)
}
