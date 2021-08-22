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
			black: colors.black,
			white: colors.white,
			success: colors.green[600],
			error: colors.red[600]
		}
	},
	variants: {
		extend: {}
	},
	plugins: []
};
