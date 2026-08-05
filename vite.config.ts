/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // Pure math and theme logic run under node; DOM-dependent suites can
    // opt into jsdom per file if they ever need it.
    environment: 'node',
  },
})
