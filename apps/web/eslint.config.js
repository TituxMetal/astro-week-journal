import webConfig from '@repo/eslint-config/web'
import astroPlugin from 'eslint-plugin-astro'

export default [
  {
    ignores: ['**/*.mjs', 'eslint.config.js']
  },
  ...webConfig,
  ...astroPlugin.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroPlugin.parser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      }
    }
  }
]
