import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

export default defineConfig({
  // server: {
  //   proxy: {
  //     "/createUser": {
  //       target: "http://localhost:8257",
  //       // changeOrigin: true,
  //       // secure: false,
  //     },
  //   },
  // },
  plugins: [react()],
});