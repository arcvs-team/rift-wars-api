import 'dotenv/config'
import { drizzle, type MySql2Database } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

let connection: mysql.Connection
let db: MySql2Database

(async () => {
  connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  })

  db = drizzle(connection)
})()

export { connection, db }
