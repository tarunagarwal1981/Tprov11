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
  }
};

export default nextConfig;
