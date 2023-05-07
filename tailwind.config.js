/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent'
    },
    borderColor: {
      DEFAULT: 'var(--color-border)',
      current: 'currentColor',
      transparent: 'transparent'
    },
    textColor: {
      DEFAULT: 'var(--color-text)',
      green: 'hsla(160, 100%, 37%, 1)'
    },
    backgroundColor: {
      DEFAULT: 'var(--color-background)',
      soft: 'var(--color-background-soft)',
      mute: 'var(--color-background-mute)',
      green: 'hsla(160, 100%, 37%, 1)',
      current: 'currentColor',
      transparent: 'transparent'
    }
  }
}
