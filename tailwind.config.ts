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
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      colors: {
        surface: '#04040a',
        card: '#0c0c18',
        border: '#1a1a2e',
        accent: '#ffffff',
        gold: '#c9a84c',
        star: '#a8c4e0',
      },
    },
  },
  plugins: [],
}
export default config
