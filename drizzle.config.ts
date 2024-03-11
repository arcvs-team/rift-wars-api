import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/infra/database/drizzle/schema.ts',
  driver: 'pg',
  dbCredentials: {
    connectionString: String(process.env.DATABASE_URL)
  },
  verbose: true,
  strict: true,
  out: './src/infra/database/drizzle/migrations/'
})
