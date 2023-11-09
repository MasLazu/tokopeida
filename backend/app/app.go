package app

import (
	"tokopeida-backend/database"
	"tokopeida-backend/handler"
	"tokopeida-backend/middleware"
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
	if err != nil {
		panic("Error loading .env file")
	}

	config := NewConfig()
	database := database.NewDatabase(config.DatabaseUrl)
	validator := validator.New()
	authService := service.NewAuthService(database, config.Jwt.SigningKey.([]byte))
	userService := service.NewUserService(database)
	productService := service.NewProductService(database, authService)
	authHandler := handler.NewAuthHandler(database, validator, authService, config.Jwt.SigningKey.([]byte))
	userHandler := handler.NewUserHandler(database, validator, authService, userService)
	storeHandler := handler.NewStoreHandler(database, validator)
	productHandler := handler.NewProductHandler(database, validator, productService)
	transactionHandler := handler.NewTransactionHandler(database, validator)
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
