import type { HeadConfig, MarkdownOptions, DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'

import pkg from '../../../package.json'

import { format, Sidebar, Social, Nav } from './helpers'
import { Github, Npm } from './icons'

const GH_URL = 'https://github.com/norskeld/sigma'
const NPM_URL = 'https://npm.im/@nrsk/sigma'

export default defineConfig({
  lang: 'en-US',
  title: 'Sigma',
  titleTemplate: false,
  description: 'TypeScript parser combinator library for building fast and convenient parsers.',

  lastUpdated: true,

  outDir: '../dist',
  cacheDir: '../cache',

  cleanUrls: 'with-subfolders',

  head: getHeadConfig(),
  markdown: getMarkdownConfig(),
  themeConfig: getThemeConfig()
})

function getHeadConfig(): Array<HeadConfig> {
  return [
    // Additional link tags.
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png'
      }
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        color: '#5bbad5',
        href: '/favicon/safari-pinned-tab.svg'
      }
    ],
    [
      'link',
      {
        rel: 'manifest',
        href: '/favicon/site.webmanifest'
      }
    ],
    // Additional meta tags.
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff'
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ]
  ]
}

function getMarkdownConfig(): MarkdownOptions {
  return {
    theme: 'nord'
  }
}

function getThemeConfig(): DefaultTheme.Config {
  return {
    logo: {
      light: '/images/logo-light.svg',
      dark: '/images/logo-dark.svg'
    },

    editLink: {
      text: 'Edit this page on GitHub',
      pattern: `${GH_URL}/edit/master/docs/docs/:path`
    },

    nav: getNav(),
    footer: getFooter(),
    sidebar: getSidebar(),
    socialLinks: getSocialLinks()
  }
}

function getNav() {
  const items = getSidebar().flatMap((item) => item.items)

  const [combinators] = items.filter((item) => item.link?.startsWith('/combinators'))
  const [parsers] = items.filter((item) => item.link?.startsWith('/parsers'))

  return [
    Nav.item('Combinators', combinators.link!),
    Nav.item('Parsers', parsers.link!),
    Nav.items(pkg.version, [Nav.item('Changelog', GH_URL + '/blob/master/CHANGELOG.md')])
  ]
}

function getSocialLinks() {
  return [Social.item(Github, GH_URL), Social.item(Npm, NPM_URL)]
}

function getSidebar() {
  return [
    Sidebar.group('Introduction', '/introduction', [
      Sidebar.item('Getting started', '/getting-started')
    ]),
    Sidebar.group('Guides', '/guides', [
      Sidebar.item('Primitives and composites', '/primitives-and-composites')
    ]),
    Sidebar.group('Combinators', '/combinators', [
      Sidebar.item('chainl', '/chainl'),
      Sidebar.item('choice', '/choice'),
      Sidebar.item('error', '/error'),
      Sidebar.item('many', '/many'),
      Sidebar.item('many1', '/many1'),
      Sidebar.item('map', '/map'),
      Sidebar.item('mapTo', '/mapTo'),
      Sidebar.item('optional', '/optional'),
      Sidebar.item('sepBy', '/sepBy'),
      Sidebar.item('sepBy1', '/sepBy1'),
      Sidebar.item('sequence', '/sequence'),
      Sidebar.item('skipUntil', '/skipUntil'),
      Sidebar.item('takeLeft', '/takeLeft'),
      Sidebar.item('takeMid', '/takeMid'),
      Sidebar.item('takeRight', '/takeRight'),
      Sidebar.item('takeSides', '/takeSides'),
      Sidebar.item('takeUntil', '/takeUntil'),
      Sidebar.item('when', '/when')
    ]),
    Sidebar.group('Parsers', '/parsers', [
      Sidebar.item('any', '/any'),
      Sidebar.item('binary', '/binary'),
      Sidebar.item('defer', '/defer'),
      Sidebar.item('eof', '/eof'),
      Sidebar.item('eol', '/eol'),
      Sidebar.item('float', '/float'),
      Sidebar.item('hex', '/hex'),
      Sidebar.item('integer', '/integer'),
      Sidebar.item('letter', '/letter'),
      Sidebar.item('letters', '/letters'),
      Sidebar.item('noneOf', '/noneOf'),
      Sidebar.item('nothing', '/nothing'),
      Sidebar.item('octal', '/octal'),
      Sidebar.item('oneOf', '/oneOf'),
      Sidebar.item('regexp', '/regexp'),
      Sidebar.item('rest', '/rest'),
      Sidebar.item('run', '/run'),
      Sidebar.item('string', '/string'),
      Sidebar.item('tryRun', '/tryRun'),
      Sidebar.item('ustring', '/ustring'),
      Sidebar.item('whitespace', '/whitespace'),
      Sidebar.item('whole', '/whole')
    ])
  ]
}

function getFooter() {
  return {
    message: format(
      `Built with <a href="https://vitepress.vuejs.org/">VitePress</a>`,
      ` &middot; `,
      `<a href="${GH_URL}/tree/master/docs">Source code</a>`
    ),

    copyright: format(
      `&copy; 2021-present`,
      ` &middot; `,
      `Licensed under <a href="${GH_URL}/blob/master/LICENSE">MIT</a>`
    )
  }
}
