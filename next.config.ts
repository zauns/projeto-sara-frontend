import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	async rewrites() {
		return [
			{
				source: "/api/:path*",
				destination: "http://backend:8080/api/:path*",
			},
		];
	},

	async redirects() {
		return [];
	},
	reactStrictMode: true, // causes double render on component mount (dev)
};

export default nextConfig;
