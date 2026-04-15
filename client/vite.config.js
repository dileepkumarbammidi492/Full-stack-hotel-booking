import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        // Keep the /api prefix so requests route to backend /api/auth and /api/bookings
        // without stripping the path.
      },
    },
  },
});
