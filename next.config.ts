import type { NextConfig } from "next";

const securityHeaders = [
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=()",
	},
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
];

const MENU_ORIGIN = "https://hideaway-menu.vercel.app";

const nextConfig: NextConfig = {
	allowedDevOrigins: ["192.168.1.6"],
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
		];
	},
	async rewrites() {
		return [
			{
				source: "/menu",
				destination: `${MENU_ORIGIN}/menu/`,
			},
			{
				source: "/menu/:path*",
				destination: `${MENU_ORIGIN}/menu/:path*`,
			},
		];
	},
};

export default nextConfig;
