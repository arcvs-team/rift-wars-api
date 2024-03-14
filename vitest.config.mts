import { defineConfig } from 'vitest/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      include: [
        'src/domain/**/application/use-cases/*.ts',
        'src/core/*.ts'
      ]
    }
  },
  plugins: [
    tsConfigPaths()
  ]
})
