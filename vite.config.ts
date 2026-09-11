import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { oidcSpa } from 'oidc-spa/vite-plugin'
import { defineConfig } from 'vite'
import { viteEnvs } from 'vite-envs'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    oidcSpa({
      enableTokenExfiltrationDefense: true,
    }),
    tailwindcss(),
    viteEnvs({
      computedEnv: async () => {
        const path = await import('node:path')
        const fs = await import('node:fs/promises')

        const packageJson = JSON.parse(
          await fs.readFile(path.resolve(__dirname, 'package.json'), 'utf-8'),
        )
        return {
          APP_VERSION: packageJson.version ?? '',
          LUNATIC_VERSION: packageJson.dependencies['@inseefr/lunatic'] ?? '',
        }
      },
    }),
  ],
})
