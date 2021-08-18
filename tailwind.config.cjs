const colors = require('tailwindcss/colors');

module.exports = {
	purge: ['./src/**/*.svelte', './src/**/*.css'],
	darkMode: false,
	theme: {
		fontFamily: {
			sans: ['Domine', 'serif'],
			serif: ['Quattrocento Sans', 'sans-serif']
		},
		colors: {
			white: colors.white,
			black: colors.black,
			blue: colors.blue,
			gray: colors.warmGray,
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
