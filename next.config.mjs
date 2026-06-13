/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        // This wildcard allows images from ANY HTTPS domain,
        // effectively covering Unsplash and Google.
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      // You technically don't need this line because of the "**" above,
      // but I moved it here from 'domains' so you can see where it goes.
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    // REMOVED: 'domains' array to fix the build error
  },
};

export default nextConfig;
