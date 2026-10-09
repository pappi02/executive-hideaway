import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

// No nonces: they would force every page to render dynamically and lose the
// hourly ISR caching. 'unsafe-inline' scripts are still needed for Next.js's
// own inline bootstrap and the scroll-reset script in app/layout.tsx; the rest
// of the policy blocks third-party scripts, plugins, framing and form hijacking.
// (vercel.live is the preview-deployment toolbar.)
const contentSecurityPolicy = [
	"default-src 'self'",
	`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://vercel.live`,
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://vercel.live https://vercel.com",
	"font-src 'self' data: https://vercel.live",
	"connect-src 'self' https://vercel.live wss://ws-us3.pusher.com",
	"frame-src https://vercel.live",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
	{ key: "Content-Security-Policy", value: contentSecurityPolicy },
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

const nextConfig: NextConfig = {
	allowedDevOrigins: ["192.168.1.6"],
	// Prisma 7's generated client (src/generated/prisma) is bundled like app code, so
	// only the PostgreSQL query compiler it imports ships — not the ~70 MB of
	// compilers for every database in @prisma/client/runtime.
	serverExternalPackages: ["bcryptjs"],
	images: {
		// Every distinct (image, width, format) is a billable transformation, and
		// Hobby includes only 5,000 a month. Fewer widths means fewer variants
		// (the defaults allow 15 per image), and a 31-day cache means each variant
		// is transformed about once a month instead of every 4 hours.
		// Replacing a file under /public: give it a new name so the change shows.
		deviceSizes: [640, 828, 1080, 1440, 1920],
		imageSizes: [64, 128, 256, 384],
		minimumCacheTTL: 60 * 60 * 24 * 31,
		// Room photos are stored in Vercel Blob (see src/lib/accommodation-images.ts).
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.public.blob.vercel-storage.com",
				pathname: "/accommodation/**",
			},
		],
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
		},
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: securityHeaders,
			},
			{
				// Original photos under /public/images (served directly by the menu's
				// CSS backgrounds and used as next/image sources). Without this they go
				// out with max-age=0 and every page view re-requests them. A day fresh,
				// then a week of background revalidation.
				source: "/images/:path*",
				headers: [
					{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
				],
			},
		];
	},
};

export default nextConfig;
