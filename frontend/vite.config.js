import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: true,  // 외부 접속 허용
    port: 3000,  // 개발 서버 포트 3000으로 변경
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: ['.ngrok-free.app']
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Model 09',
        short_name: 'M09',
        description: '작업현장 동행 스마트 주행 카트 서비스',
        theme_color: '#ffffff',           // 앱의 테마 색상
        background_color: '#ffffff',      // 스플래시 화면 배경색
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/app/styles/reset";
          @use "@/app/styles/variables" as *;
        `,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})