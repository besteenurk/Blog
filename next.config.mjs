/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
      {
        source: "/blog/:slug",
        destination: "/yazilar/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
