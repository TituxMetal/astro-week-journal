import baseConfig from './base.js'

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        fetch: 'readonly'
      }
    },
    rules: {
      // Warn about console in frontend (should use proper logging or remove)
      'no-console': 'warn'
    }
  }
]
