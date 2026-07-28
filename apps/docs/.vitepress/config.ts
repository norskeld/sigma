import pkg from '@nrsk/sigma/package.json'
import vueJsx from '@vitejs/plugin-vue-jsx'
import type { DefaultTheme, HeadConfig, MarkdownOptions } from 'vitepress'
import { defineConfig } from 'vitepress'

import { Content, Nav, Sidebar, Social, capitalize, format } from './helpers'
import { Github, Npm } from './icons'

const GH_URL = 'https://github.com/norskeld/sigma'
const NPM_URL = 'https://npmjs.com/package/@nrsk/sigma'

export default defineConfig({
  lang: 'en-US',
  title: 'Sigma',
  titleTemplate: false,
  description: 'TypeScript parser combinator library for building fast and convenient parsers.',
  lastUpdated: true,
  srcDir: './content',
  cleanUrls: true,
  head: getHeadConfig(),
  markdown: getMarkdownConfig(),
  themeConfig: getThemeConfig(),
  vite: {
    plugins: [vueJsx()],
  },
})

function getHeadConfig(): Array<HeadConfig> {
  return [
    // Additional link tags.
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        color: '#5bbad5',
        href: '/favicon/safari-pinned-tab.svg',
      },
    ],
    [
      'link',
      {
        rel: 'manifest',
        href: '/favicon/site.webmanifest',
      },
    ],
    // Additional meta tags.
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
    ],
  ]
}

function getMarkdownConfig(): MarkdownOptions {
  return {
    theme: 'nord',
  }
}

function getThemeConfig(): DefaultTheme.Config {
  return {
    logo: {
      light: '/images/logo-light.svg',
      dark: '/images/logo-dark.svg',
    },

    editLink: {
      text: 'Edit this page on GitHub',
      pattern: `${GH_URL}/edit/master/apps/docs/content/:path`,
    },

    nav: getNav(),
    footer: getFooter(),
    sidebar: getSidebar(),
    socialLinks: getSocialLinks(),

    outline: {
      level: 'deep',
    },

    search: {
      provider: 'local',
    },
  }
}

function getNav() {
  const items = getSidebar().flatMap((item) => item.items ?? [])

  const [guides] = items.filter((item) => item.link?.startsWith('/guides') ?? false)
  const [core] = items.filter((item) => item.link?.startsWith('/core') ?? false)
  const [combinators] = items.filter((item) => item.link?.startsWith('/combinators') ?? false)
  const [parsers] = items.filter((item) => item.link?.startsWith('/parsers') ?? false)
  const [types] = items.filter((item) => item.link?.startsWith('/types') ?? false)

  return [
    Nav.item('Guides', guides.link!),
    Nav.item('Core', core.link!),
    Nav.item('Combinators', combinators.link!),
    Nav.item('Parsers', parsers.link!),
    Nav.item('Types', types.link!),
    Nav.items(pkg.version, [
      Nav.item('Changelog', GH_URL + '/blob/master/packages/sigma/CHANGELOG.md'),
    ]),
  ]
}

function getSocialLinks() {
  return [Social.item(Github, GH_URL), Social.item(Npm, NPM_URL)]
}

function getSidebar() {
  const contentDir = Content.getContentDir()

  return Content.getContentFolders(contentDir).map((folder) =>
    Sidebar.group(capitalize(folder), `/${folder}`, Content.getItems(`${contentDir}/${folder}`)),
  )
}

function getFooter() {
  return {
    message: format(
      `Built with <a href="https://vitepress.vuejs.org/">VitePress</a>`,
      ` &middot; `,
      `<a href="${GH_URL}/tree/master/apps/docs">Source code</a>`,
    ),

    copyright: format(
      `&copy; 2021-present`,
      ` &middot; `,
      `Licensed under <a href="${GH_URL}/blob/master/LICENSE">MIT</a>`,
    ),
  }
}
