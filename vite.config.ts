import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart(),
    // Official TanStack Start on Vercel: nitro() immediately after tanstackStart().
    nitro(),
    viteReact(),
  ],
})

export default config
