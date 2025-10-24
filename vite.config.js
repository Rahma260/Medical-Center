import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@mui/x-data-grid > @mui/x-data-grid-pro',  // Handles internal deps
      '@mui/x-data-grid',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
    ],
    force: true,  // Re-optimize deps on every start (fixes cache issues)
  },
  build: {
    rollupOptions: {
      // Ensure MUI exports are preserved
      external: [],
    },
  },
  server: {
    fs: {
      strict: false,
    },
  },
});