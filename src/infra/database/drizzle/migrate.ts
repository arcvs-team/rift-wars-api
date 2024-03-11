import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

async function run () {
  const migrationClient = postgres(String(process.env.DATABASE_URL), { max: 1 })

  try {
    await migrate(drizzle(migrationClient), {
      migrationsFolder: 'src/infra/database/drizzle/migrations'
    })

    console.log('Migration successfully applied!')
    await migrationClient.end()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
run()
