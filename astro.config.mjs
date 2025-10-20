// @ts-check
import { defineConfig } from 'astro/config'

import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import icon from 'astro-icon'

export default defineConfig({
  integrations: [react(), icon({ iconDir: 'src/assets/icons' })],
  vite: { plugins: [tailwindcss()] },
  output: 'server',
  security: { checkOrigin: true },
  adapter: node({ mode: 'standalone' })
})
