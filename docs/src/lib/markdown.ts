import { join } from 'path'

import { shikigami, loadTheme } from '@nrsk/shikigami'
import anchor from 'markdown-it-anchor'
import markdown from 'markdown-it'

export async function processMarkdown(input: string, themeName: string) {
  const permalink = anchor.permalink.ariaHidden({ placement: 'after' })

  const themePath = join(process.cwd(), `src/syntax/${themeName}.json`)
  const theme = await loadTheme(themePath)

  const parser = markdown('default', {
    html: true,
    linkify: true,
    typographer: true
  })
    .use(
      await shikigami({
        withLanguage: true,
        withLineNumbers: true,
        highlightInvert: true,
        highlighter: {
          theme
        }
      })
    )
    .use(anchor, { permalink, slugify })

  return parser.render(input)
}

function slugify(string: string) {
  return string
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
