package main

import "tokopeida-backend/app"

func main() {
	app := app.NewApp()
	defer app.Database.CloseConn()
	app.Start()
}
