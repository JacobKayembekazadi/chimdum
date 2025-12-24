import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [
      react(),
      visualizer({
        open: false,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      }),
    ],
    // API keys are now handled server-side via Edge Functions
    // No need to expose them in client-side code
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'genai-vendor': ['@google/genai'],
            'openai-vendor': ['openai'],
          },
        },
      },
    },
  };
});
