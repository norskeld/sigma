import { defineConfig, type MarkdownOptions, type DefaultTheme } from 'vitepress'

import { format, Sidebar, Social, Nav } from './helpers'
import { Github, Npm } from './icons'

const GH_URL = 'https://github.com/norskeld/sigma'
const NPM_URL = 'https://npm.im/@nrsk/sigma'

export default defineConfig({
  lang: 'en-US',
  title: 'Sigma',
  titleTemplate: 'Sigma',
  description: 'TypeScript parser combinator library for building fast and convenient parsers.',

  appearance: 'dark',
  lastUpdated: true,

  outDir: '../dist',
  cleanUrls: 'with-subfolders',

  markdown: getMarkdownConfig(),
  themeConfig: getThemeConfig()
})

function getMarkdownConfig(): MarkdownOptions {
  return {
    theme: 'nord'
  }
}

function getThemeConfig(): DefaultTheme.Config {
  return {
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

  const combinators = items.filter((item) => item.link?.startsWith('/combinators')).at(0)!
  const parsers = items.filter((item) => item.link?.startsWith('/parsers')).at(0)!

  return [Nav.item('Combinators', combinators.link!), Nav.item('Parsers', parsers.link!)]
}

function getSocialLinks() {
  return [Social.item(Github, GH_URL), Social.item(Npm, NPM_URL)]
}

function getSidebar() {
  return [
    Sidebar.group('Introduction', '/introduction', [
      Sidebar.item('Getting started', '/getting-started')
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
