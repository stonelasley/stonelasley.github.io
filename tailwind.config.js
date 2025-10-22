/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#212121',
            a: {
              color: '#212121',
              textDecoration: 'underline',
              '&:hover': {
                color: '#424242',
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: '#212121',
              fontWeight: '700',
            },
            strong: {
              color: '#212121',
            },
            code: {
              color: '#212121',
            },
            img: {
              borderRadius: '0',
              marginTop: '2rem',
              marginBottom: '2rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
