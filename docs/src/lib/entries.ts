import { readdir as readDir, readFile } from 'fs/promises'
import { join, relative, resolve } from 'path'

import simpleGit from 'simple-git'
import matter from 'gray-matter'

import { DOCS_SYNTAX_THEME, DOCS_EDIT_URL, DOCS_DIR } from '@/config/content'
import { processMarkdown } from '@/lib/markdown'

export interface EntryId {
  id: string | Array<string>
  [param: string]: string | Array<string>
}

export interface EntryMatter {
  title: string
  description: string
}

export interface EntryData {
  content: string
}

export type Entry = EntryId & EntryMatter & EntryData

function getEntriesLocation(): string {
  return DOCS_DIR
}

function getSyntaxTheme(): string {
  return DOCS_SYNTAX_THEME
}

function getDocsEditUrlBase(): string {
  return DOCS_EDIT_URL
}

export function getEntryEditLink(id: string): string {
  return `${getDocsEditUrlBase()}/${id}.md`
}

export async function getEntryLastChange(id: string): Promise<string> {
  const baseDir = process.cwd()

  const git = simpleGit({
    baseDir,
    binary: 'git'
  })

  const { latest } = await git.log({
    file: `${baseDir}/${getEntriesLocation()}/${id}.md`,
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
  const entriesPath = join(process.cwd(), getEntriesLocation())
  const entries = await getPathsR(entriesPath)

  return entries.map((entry) => {
    const entriesSubPath = relative(entriesPath, entry)
    const entriesName = entriesSubPath.replace(/\.md$/, '')
    const entriesId = entriesName.split('/')

    return {
      params: {
        id: entriesId
      }
    }
  })
}

export async function getEntry(id: string): Promise<Entry> {
  const entryPath = join(process.cwd(), getEntriesLocation(), `${id}.md`)
  const entryContents = await readFile(entryPath, { encoding: 'utf8' })

  const { content: rawContent, ...rest } = extractFrontmatter(entryContents)
  const content = await processMarkdown(rawContent, getSyntaxTheme())

  return {
    id,
    content,
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
