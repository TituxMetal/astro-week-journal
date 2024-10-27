// @ts-check
import { defineConfig } from 'astro/config'

import node from '@astrojs/node'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import icon from 'astro-icon'

export default defineConfig({
  integrations: [react(), tailwind(), icon({ iconDir: 'src/assets/icons' })],
  output: 'server',
  security: {
    checkOrigin: true
  },
  adapter: node({
    mode: 'standalone'
  })
})
