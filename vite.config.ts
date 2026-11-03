import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// 幹事（index.html）と参加者（vote.html）は別の入口。
// 送ったリンクを開いた参加者は、幹事の画面を通らずに投票画面に着く。
export default defineConfig({
  plugins: [react()],
  // 相対パスで書き出す。どんな静的ホストのどの階層に置いても動く
  base: './',
  build: {
    rollupOptions: {
      input: {
        kanji: 'index.html',
        vote: 'vote.html',
      },
    },
  },
  test: {
    environment: 'node',
  },
})
