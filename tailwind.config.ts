import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			height: {
				'banner-sm': '320px',
				'banner-md': '480px',
				'banner-lg': '560px',
			},
			colors: {
				'nexus-cyan': '#00FFFF',
				'nexus-orange': '#FF6B00',
			},
			fontFamily: {
				orbitron: ['var(--font-orbitron)'],
			},
		},
	},
	plugins: [],
};

export default config;
