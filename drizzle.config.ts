import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/infra/database/drizzle/schema.ts',
  driver: 'mysql2',
  dbCredentials: {
    host: String(process.env.DATABASE_HOST),
    user: String(process.env.DATABASE_USER),
    password: String(process.env.DATABASE_PASSWORD),
    database: String(process.env.DATABASE_NAME)
  },
  verbose: true,
  strict: true,
  out: './src/infra/database/drizzle/migrations/'
})
