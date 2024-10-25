/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  useFileSystemPublicRoutes: false,
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
