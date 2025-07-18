/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  // Configuración específica para App Router
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  transpilePackages: [],
}

module.exports = nextConfig