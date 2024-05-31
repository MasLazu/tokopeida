package app

import (
	"tokopeida-backend/handler"
	"tokopeida-backend/middleware"

	"github.com/labstack/echo/v4"
	logger "github.com/labstack/echo/v4/middleware"
)

func SetupRoute(
	e *echo.Echo,
	authHandler *handler.AuthHandler,
	userHandler *handler.UserHandler,
	storeHandler *handler.StoreHandler,
	productHandler *handler.ProductHandler,
	transactionHandler *handler.TransactionHandler,
	wishlistHandler *handler.WishlistHandler,
	cartHandler *handler.CartHandler,
	authMiddleware *middleware.AuthMiddleware,
	corsMiddleware *middleware.CorsMiddleware,
) {
	corsMiddleware.Cors(e)
	e.Use(logger.Logger())

	e.Static("/assets", "static")

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
	user.POST("/current/topup", userHandler.TopUp, authMiddleware.LoginOnly)
	user.GET("/current/transaction", transactionHandler.GetAllCurrentUserTransaction, authMiddleware.LoginOnly)

	store := e.Group("/store")
	store.GET("", storeHandler.GetAll)
	store.GET("/:id", storeHandler.GetByID)
	store.GET("/:id/product", productHandler.GetAllStoreProduct)
	store.GET("/current", storeHandler.GetCurrent, authMiddleware.LoginOnly)
	store.POST("/current", storeHandler.CreateCurrentUserStore, authMiddleware.LoginOnly)
	store.PUT("/current", storeHandler.UpdateCurrent, authMiddleware.LoginOnly)
	store.POST("/current/product", productHandler.CreateCurrentStoreProduct, authMiddleware.LoginOnly)
	store.PUT("/current/product/:id", productHandler.UpdateCurrentStoreProduct, authMiddleware.LoginOnly)
	store.GET("/:id/transaction", transactionHandler.GetAllStoreTransaction)

	product := e.Group("/product")
	product.GET("", productHandler.GetAll)
	product.GET("/:id", productHandler.GetByID)
	product.POST("/:id/buy", productHandler.Buy, authMiddleware.LoginOnly)
	product.POST("/buy-multiple", productHandler.BuyMultiple, authMiddleware.LoginOnly)
	product.GET("/explore/:amount", productHandler.GetExploreProduct)
	product.GET("/search/:keyword", productHandler.Search)

	transaction := e.Group("/transaction")
	transaction.GET("", transactionHandler.GetAll)
	transaction.GET("/:id", transactionHandler.GetByID)

	wishlist := e.Group("/wishlist")
	wishlist.GET("/current", wishlistHandler.GetAllCurrentUser, authMiddleware.LoginOnly)
	wishlist.POST("/:product_id", wishlistHandler.Create, authMiddleware.LoginOnly)
	wishlist.DELETE("/:product_id", wishlistHandler.Delete, authMiddleware.LoginOnly)

	cart := e.Group("/cart")
	cart.POST("", cartHandler.Create, authMiddleware.LoginOnly)
	cart.PUT("/:product_id", cartHandler.Update, authMiddleware.LoginOnly)
	cart.GET("/current", cartHandler.GetAllCurrentUser, authMiddleware.LoginOnly)
	cart.DELETE("/:product_id", cartHandler.Delete, authMiddleware.LoginOnly)
}
