import { readFile } from 'fs/promises'
import { join } from 'path'

import { shikigami, loadTheme } from '@nrsk/shikigami'
import markdown from 'markdown-it'
import anchor from 'markdown-it-anchor'
import { BUNDLED_LANGUAGES } from 'shiki'

export async function processMarkdown(input: string, themeName: string) {
  const permalink = anchor.permalink.ariaHidden({ placement: 'after' })
  const highlighter = await createShikiHighlighter(themeName)

  const parser = markdown('default', {
    html: true,
    linkify: true,
    typographer: true
  })
    .use(anchor, { permalink, slugify })
    .use(highlighter)

  return parser.render(input)
}

async function loadShikiTheme(themeName: string) {
  const themePath = join(process.cwd(), `src/syntax/themes/${themeName}.json`)
  const theme = await loadTheme(themePath)

  return theme
}

async function loadShikiLanguages(langs: Array<string>) {
  const languagesDir = join(process.cwd(), `src/syntax/languages`)

  const loaded = await Promise.all(
    langs.map(async (lang) => {
      const languagePath = join(languagesDir, `${lang}.tmLanguage.json`)
      const languageJson = JSON.parse(await readFile(languagePath, { encoding: 'utf8' }))

      // NOTE: This is a hack, but I couldn't find any other ways to make shiki register a custom
      // language. The official example of simple reading and parsing a JSON and then passing it
      // to highlighter instance doesn't seem to work.
      const language = {
        id: languageJson.name,
        scopeName: languageJson.scopeName,
        path: languagePath,
        ...(languageJson.aliases && {
          aliases: languageJson.aliases
        })
      }

      return language
    })
  )

  return loaded
}

async function createShikiHighlighter(themeName: string) {
  const theme = await loadShikiTheme(themeName)
  const langs = await loadShikiLanguages(['bnf'])

  return await shikigami({
    withLanguage: false,
    withLineNumbers: true,
    highlightInvert: false,
    highlighter: {
      theme,
      langs: [...BUNDLED_LANGUAGES, ...langs]
    }
  })
}

function slugify(string: string) {
  return string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
