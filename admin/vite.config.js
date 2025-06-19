import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
       host: '0.0.0.0', // Allows access from other devices on the local network
    port: 5173,      // Use the desired port number
  }

})



