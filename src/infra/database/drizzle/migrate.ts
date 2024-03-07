import 'dotenv/config'
import { migrate } from 'drizzle-orm/mysql2/migrator'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

async function run () {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  })

  const db = drizzle(connection)

  try {
    await migrate(db, {
      migrationsFolder: 'src/infra/database/drizzle/migrations'
    })

    await connection.end()
    console.log('Migration successfully applied!')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
run()
