/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        dmSerif: ['"DM Serif Display"', 'Georgia', 'serif'],
        dmSans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        docNavy: '#042E7B',
        docRoyal: '#004EE0',
        docSky: '#1883FF',
        docPastel: '#99CAFF',
        docIce: '#E3F2FF',
      },
    },
  },
  plugins: [],
}

