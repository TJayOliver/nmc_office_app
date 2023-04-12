/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.{html,js,ejs}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      xxl: '1609px'
    },
    extend: {
      colors:{
        backgroundColorBlack:   'var(--backgroundColorBlack)',
        ColorBlack:             'var(--ColorBlack)',              // header color
        HoverColorBlack:        'var(--HoverColorBlack)',
        searchInputbgBlack:     'var(--searchInputbgBlack)',
        fontColorBlackWhite:    'var(--fontColorBlackWhite)',     // font black on white mode
        fontColorWhiteBlack:    'var(--fontColorWhiteBlack)',     // font white on black mode
        BoxHoverColor:          'var(--BoxHoverColor)',
        backgroundColorWhite:   'var(--backgroundColorWhite)'     // log out color background
      },
      
    },
  },
  plugins: [],
}
