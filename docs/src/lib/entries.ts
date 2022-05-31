import { readdir as readDir, readFile } from 'fs/promises'
import { join, relative, resolve, dirname, basename } from 'path'

import matter from 'gray-matter'
import simpleGit from 'simple-git'

import { DOCS_SYNTAX_THEME, DOCS_EDIT_URL, DOCS_DIR } from '@/config/content'
import { processMarkdown } from '@/lib/markdown'

export interface EntryId {
  id: string | Array<string>
  [param: string]: string | Array<string>
}

export interface EntryMatter {
  kind?: string
  title: string
  description: string
}

export interface EntryData {
  content: string
}

export type Entry = EntryId & EntryMatter & EntryData

export function getEntryEditLink(id: string): string {
  return `${DOCS_EDIT_URL}/${id}.md`
}

export async function getEntryLastChange(id: string): Promise<string> {
  const baseDir = process.cwd()

  const git = simpleGit({
    baseDir,
    binary: 'git'
  })

  const { latest } = await git.log({
    file: `${baseDir}/${DOCS_DIR}/${id}.md`,
    format: {
      date: '%cI'
    }
  })

  return latest?.date ?? new Date().toISOString()
}

async function getPathsR(location: string): Promise<Array<string>> {
  const entries = await readDir(location, { withFileTypes: true })

  const files = await Promise.all(
    entries.map((entry) => {
      const path = resolve(location, entry.name)
      return entry.isDirectory() ? getPathsR(path) : path
    })
  )

  return files.flat()
}

export async function getEntriesId(): Promise<Array<{ params: EntryId }>> {
  const entriesPath = join(process.cwd(), DOCS_DIR)
  const entries = await getPathsR(entriesPath)

  return (
    entries
      // Exclude section files to avoid Next.js trying to render them.
      .filter((entry) => {
        const fileName = basename(entry)
        return !(fileName.startsWith('@') && fileName.endsWith('.json'))
      })
      .map((entry) => {
        const entriesSubPath = relative(entriesPath, entry)
        const entriesName = entriesSubPath.replace(/\.md$/, '')
        const entriesId = entriesName.split('/')

        return {
          params: {
            id: entriesId
          }
        }
      })
  )
}

export async function getEntry(id: string): Promise<Entry> {
  const entryPath = join(process.cwd(), DOCS_DIR, `${id}.md`)
  const sectionPath = join(dirname(entryPath), `@section.json`)

  const entryContents = await readFile(entryPath, { encoding: 'utf8' })
  const sectionContents = await readFile(sectionPath, { encoding: 'utf8' })

  const { content: rawContent, ...rest } = extractFrontmatter(entryContents)
  const content = await processMarkdown(rawContent, DOCS_SYNTAX_THEME)
  const section = JSON.parse(sectionContents)

  return {
    id,
    content,
    ...section,
    ...rest
  }
}

function extractFrontmatter(md: string): EntryData & EntryMatter {
  const { content, data } = matter(md)

  return {
    content: content.trim(),
    ...(data as EntryMatter)
  }
}
