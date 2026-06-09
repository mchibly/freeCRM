import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    // Aponta para o arquivo de setup para os testes da app 'web'
    setupFiles: ['./apps/web/vitest.setup.ts'],
    include: ['apps/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['apps/**/src/**/*.{ts,tsx}'],
      exclude: ['apps/**/*.test.{ts,tsx}'],
    },
  },
});