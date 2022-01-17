import { type DefaultSeoProps } from 'next-seo'

/**
 * Common options that are handy.
 *
 * **Note**: `host` is required since it's used for Open Graph links that must be **absolute**.
 */
export const Common = {
  host: 'https://sigma.vm.codes',
  title: 'Sigma',
  description:
    'Sigma is a TypeScript parser combinator library for building fast and convenient parsers.'
} as const

/** Default SEO options/properties that are passed to `next-seo` and universal across all pages. */
export const Seo: DefaultSeoProps = {
  defaultTitle: Common.title,
  titleTemplate: `${Common.title} :: %s `,
  description: Common.description,
  openGraph: {
    type: 'website',
    url: Common.host,
    title: Common.title,
    description: Common.description,
    images: [
      {
        url: Common.host + '/images/og-image.png',
        secureUrl: Common.host + '/images/og-image.png',
        type: 'image/png',
        width: 1280,
        height: 640,
        alt: 'Logotype'
      }
    ]
  },
  twitter: {
    cardType: 'summary_large_image'
  },
  additionalLinkTags: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicon/apple-touch-icon.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon/favicon-32x32.png'
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon/favicon-16x16.png'
    },
    {
      rel: 'mask-icon',
      color: '#5bbad5',
      href: '/favicon/safari-pinned-tab.svg'
    },
    {
      rel: 'manifest',
      href: '/favicon/site.webmanifest'
    }
  ],
  additionalMetaTags: [
    {
      name: 'theme-color',
      content: '#ffffff'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }
  ]
}
