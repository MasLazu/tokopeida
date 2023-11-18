package database

import (
	"database/sql"

	_ "github.com/lib/pq"
)

type Database struct {
	Conn *sql.DB
}

func NewDatabase(databaseUrl string) *Database {
	db, err := sql.Open("postgres", databaseUrl)
	if err != nil {
		panic(err)
	}

	return &Database{
		Conn: db,
	}
}

func (db *Database) BeginTransaction() (*sql.Tx, error) {
	return db.Conn.Begin()
}

func (db *Database) CloseConn() {
	if err := db.Conn.Close(); err != nil {
		panic(err)
	}
}
