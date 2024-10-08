import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';


// https://vitejs.dev/config/
export default defineConfig({
  server: {
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
