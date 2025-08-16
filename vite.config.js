import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';


// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/proxy': {
        target: 'http://localhost:8888/.netlify/functions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, '/proxy'),
      },
      '/stream': {  // Proxy /stream to remote WS
        target: 'wss://warthognode.duckdns.org',
        ws: true,
        changeOrigin: true,
        secure: true,  // For wss
        rewrite: (path) => path.replace(/^\/stream/, '/stream'),
      },
      '/ws/chain_delta': {  // Same for chain_delta if needed
        target: 'wss://warthognode.duckdns.org',
        ws: true,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/ws\/chain_delta/, '/ws/chain_delta'),
      },
    },
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Access-Control-Allow-Origin': '*'
    }
  },
  plugins: [react(),
      viteCompression()
  ],
  resolve: {
    alias: {
      '@': '/src', // Maps '@' to your 'src' directory
    },
  },
})
