import { defineConfig, mergeConfig } from 'vitest/config'

import defaultConfig from './vite.config'

// https://vitest.dev/config/file.html
export default defineConfig(
  mergeConfig(
    defaultConfig,
    defineConfig({
      test: {
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        setupFiles: ['src/testing/setup.ts'],
        coverage: {
          reporter: ['text', 'lcov'],
        },
      },
    }),
  ),
)
