// Meridian UI v1.4.2
// Colour tokens only. Spacing and type use Tailwind defaults (not tokenised).
module.exports = {
  content: ['./**/*.html'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF5FE',
          100: '#D6E7FC',
          500: '#2F80ED', // primary. Fails AA for small text on white (about 3.9:1)
          600: '#1F6FD9',
          700: '#1858AD',
        },
        ink: {
          900: '#1A2433',
          700: '#3D4A5C',
          500: '#6B7789',
          300: '#B6BFCC',
          100: '#EEF1F5',
        },
        danger: { 500: '#D64545', 50: '#FDEDED' },
        warning: { 500: '#E8A33D', 50: '#FDF5E7' },
        // success: planned, never shipped
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
};
