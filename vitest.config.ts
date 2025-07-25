import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, 
    environment: 'node', 
    exclude: [
      '**/node_modules/**', 
      '**/out/**',        
      'example/**',
    ],
    includeSource: ['lib/**/*.ts'], 
    deps: {
      interopDefault: true,
    },
}});
