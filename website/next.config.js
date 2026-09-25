const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
})

const basePath = process.env.GITHUB_ACTIONS ? '/talos-thr-lotvpn-research' : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@elastic/eui',
    '@elastic/datemath',
    'moment',
  ],
  reactStrictMode: true,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      }
    }
    return config
  },
}

module.exports = withNextra(nextConfig)

