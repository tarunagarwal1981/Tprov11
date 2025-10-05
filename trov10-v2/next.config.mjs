/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Supabase SSR compatibility
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr']
  },
  // Disable webpack caching to prevent Windows file locking issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;
