package app

import (
	"tokopeida-backend/database"
	"tokopeida-backend/handler"
	"tokopeida-backend/middleware"
	"tokopeida-backend/repository"
	"tokopeida-backend/service"

	"github.com/go-playground/validator/v10"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

type App struct {
	Instance *echo.Echo
	Config   *Config
	Database *database.Database
}

func NewApp() *App {
	err := godotenv.Load()
	if err != nil &&
		err.Error() != "open .env: The system cannot find the file specified." &&
		err.Error() != "open .env: no such file or directory" {
		panic("Error loading .env file : " + err.Error() + "\n")
	}

	config := NewConfig()
	database := database.NewDatabase(config.DatabaseUrl)
	validator := validator.New()

	userRepository := repository.NewUserRepository(database.Conn)
	storeRepository := repository.NewStoreRepository(database.Conn)
	productRepository := repository.NewProductRepository(database.Conn)
	transactionRepository := repository.NewTransactionRepository(database.Conn)
	wishlistRepository := repository.NewWishlistRepository(database.Conn)
	cartRepository := repository.NewCartRepository(database.Conn)
	refreshTokenRepository := repository.NewRefreshTokenRepository(database.Conn)
	productImageRepository := repository.NewProductImageRepository(database.Conn)

	authService := service.NewAuthService(config.Jwt.SigningKey.([]byte), userRepository, refreshTokenRepository)
	userService := service.NewUserService(userRepository)
	productService := service.NewProductService(
		database,
		productRepository,
		storeRepository,
		transactionRepository,
		userRepository,
		productImageRepository,
		authService,
	)

	authHandler := handler.NewAuthHandler(config.Jwt.SigningKey.([]byte), validator, refreshTokenRepository, authService)
	userHandler := handler.NewUserHandler(validator, userRepository, authService, userService)
	storeHandler := handler.NewStoreHandler(validator, storeRepository)
	productHandler := handler.NewProductHandler(validator, productRepository, productService)
	transactionHandler := handler.NewTransactionHandler(validator, transactionRepository)
	wishlistHandler := handler.NewWishlistHandler(productRepository, wishlistRepository)
	cartHandler := handler.NewCartHandler(validator, cartRepository, productRepository)

	authMiddleware := middleware.NewAuthMiddleware(config.Jwt)
	corsMiddleware := middleware.NewCorsMiddleware(config.Domain)

	instance := echo.New()
	SetupRoute(
		instance,
		authHandler,
		userHandler,
		storeHandler,
		productHandler,
		transactionHandler,
		wishlistHandler,
		cartHandler,
		authMiddleware,
		corsMiddleware,
	)

	return &App{
		Instance: instance,
		Config:   config,
		Database: database,
	}
}

func (app *App) Start() {
	app.Instance.Logger.Fatal(app.Instance.Start(":" + app.Config.Port))
}
