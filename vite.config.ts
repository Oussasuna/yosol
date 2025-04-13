
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Listen on all addresses
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": "buffer",
    },
  },
  define: {
    // Provide polyfills
    'process.env': {},
    'global': 'window',
  },
  build: {
    rollupOptions: {
      external: [
        'rpc-websockets/dist/lib/client',
        'fs',
        'os',
        'path',
        'util',
        'crypto',
        'events',
        'stream',
        'buffer',
        'http'
      ],
    },
  },
}));
