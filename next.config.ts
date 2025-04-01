import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'media.rawg.io',
				port: '',
				pathname: '/media/**', // wildcard to match all paths under /media/
			},
		],
	},
	reactStrictMode: true,
};

export default nextConfig;
