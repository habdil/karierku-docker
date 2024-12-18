/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rbxzvgiukwypxhjvyixn.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Konfigurasi untuk menangani rute dinamis
  async headers() {
    return [
      {
        source: '/api/auth/callback/google',
        headers: [
          {
            key: 'x-next-dynamic-route',
            value: 'true',
          },
        ],
      },
    ]
  },
  // Pengecualian untuk static generation
  unstable_excludeFiles: [
    '/api/auth/callback/google',
    '/dashboard-admin/**',
  ],
};

export default nextConfig;