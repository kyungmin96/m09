import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 여기에 커스텀 설정 추가
    },
  },
  plugins: [],
} satisfies Config;
