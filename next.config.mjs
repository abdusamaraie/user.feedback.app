/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  transpilePackages: ['payload', '@payloadcms/next', '@payloadcms/db-postgres']
};

export default nextConfig;
