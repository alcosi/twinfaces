/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_TWINS_API_URL: process.env.NEXT_PUBLIC_TWINS_API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
