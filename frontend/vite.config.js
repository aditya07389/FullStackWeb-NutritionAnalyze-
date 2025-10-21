import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is the proxy configuration
    proxy: {
      // Any request starting with "/api" will be forwarded
      '/api': {
        // Your backend server is running on port 5001
        // Use IPv4 to avoid localhost resolving to ::1 (IPv6) on some systems
        target: 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
    },
  },
});