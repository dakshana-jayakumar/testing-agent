import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        'mock-server/',
        '**/*.d.ts',
        '**/*.config.*',
        'dist/',
        'scripts/'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },
    // Mock configuration
    deps: {
      inline: ['better-sqlite3'] // Inline dependencies for mocking
    },
    // Test timeout
    testTimeout: 30000,
    hookTimeout: 30000
  },
  resolve: {
    alias: {
      '@': '/src',
      '@/cli': '/src/cli',
      '@/core': '/src/core',
      '@/ai': '/src/ai',
      '@/playwright': '/src/playwright',
      '@/config': '/src/config',
      '@/utils': '/src/utils',
      '@/types': '/src/types'
    }
  }
});
