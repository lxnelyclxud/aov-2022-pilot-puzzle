import { Config } from 'tailwindcss'

export default <Config>{
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      black: {
        DEFAULT: '#181818',
        soft: '#222222',
        mute: '#282828'
      },
      white: {
        DEFAULT: '#ffffff',
        soft: '#f8f8f8',
        mute: '#f2f2f2'
      },
      indigo: '#2c3e50',
      gray: '#545454',
      green: '#42b883',
      red: '#ed3c50'
    }
  }
}
