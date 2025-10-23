/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },

    async rewrites() {
        return [
            {
                source: "/admin/:path*",
                destination: "http://admin.booleanforce.localhost:3000/:path*",
            },
        ];
    },
};

export default nextConfig;
