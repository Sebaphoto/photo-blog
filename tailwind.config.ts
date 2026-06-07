import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        surface: '#0f0f0f',
        card: '#1a1a1a',
        border: '#2a2a2a',
        accent: '#e8e0d0',
      },
    },
  },
  plugins: [],
}
export default config
