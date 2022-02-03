const scriptSrcDomains =
  process.env.NODE_ENV === 'development'
    ? '*.googletagmanager.com *.youtube.com localhost:*'
    : '*.googletagmanager.com *.youtube.com'

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' ${scriptSrcDomains};
  child-src *.youtube.com *.youtube-nocookie.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com;
  img-src * blob: data:;
  media-src 'self';
  connect-src *;
`

const headers = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, '')
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  }
]

export default {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: '/start',
        destination: '/introduction/getting-started',
        permanent: true
      },
      {
        source: '/guides',
        destination: '/guides/parser-combinators-101',
        permanent: true
      },
      {
        source: '/combinators',
        destination: '/combinators/chain',
        permanent: true
      },
      {
        source: '/parsers',
        destination: '/parsers/defer',
        permanent: true
      }
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers
      }
    ]
  },

  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils'
      })
    }

    return config
  }
}
