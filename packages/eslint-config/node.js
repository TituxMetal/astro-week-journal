import baseConfig from './base.js'

export default [
  ...baseConfig,
  {
    languageOptions: {
      globals: {
        NodeJS: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    rules: {
      // Allow console in backend (but prefer proper logging libraries)
      'no-console': 'off',
      // NestJS uses decorators extensively
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          // Ignore unused parameters in decorators
          args: 'after-used'
        }
      ],
      // Allow empty interfaces for NestJS DTOs
      '@typescript-eslint/no-empty-interface': 'off'
    }
  }
]
