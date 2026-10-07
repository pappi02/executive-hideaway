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

const nextConfig: NextConfig = {
	allowedDevOrigins: ["192.168.1.6"],
	serverExternalPackages: ["@prisma/client", "bcryptjs"],
	// Prisma ships WebAssembly engines for every database (Postgres, MySQL, SQLite,
	// SQL Server, CockroachDB) plus edge/React Native runtimes. This app uses the
	// native library engine only (runtime/library.js), but file tracing copied all
	// of them into every function: ~55 MB per function, multiplied across every
	// retained deployment in the "Functions Storage" usage meter.
	outputFileTracingExcludes: {
		"/**": [
			"./node_modules/@prisma/client/runtime/*.wasm-base64.*",
			"./node_modules/@prisma/client/runtime/query_engine_bg.*",
			"./node_modules/@prisma/client/runtime/query_compiler_bg.*",
			"./node_modules/@prisma/client/runtime/wasm-*-edge.*",
			"./node_modules/@prisma/client/runtime/edge*",
			"./node_modules/@prisma/client/runtime/react-native.js",
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
		];
	},
};

export default nextConfig;
